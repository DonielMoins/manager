#! /usr/bin/env node
/* eslint-disable no-console */

const axios = require('axios');
const { mkdir, readFile, rm, access } = require('fs/promises');
const { createWriteStream, createReadStream, constants } = require('fs');
const path = require('path');
const url = require('url');
const tar = require('tar');
const zlib = require('zlib');

const getPackagesList = async () => {
  const packages = await readFile(path.resolve('packages-list.txt'), 'utf-8');
  return packages
    .split('\n')
    .filter((l) => !!l)
    .map((packageVersion) => {
      if (packageVersion.startsWith('@')) {
        const [, name, version] = packageVersion.split('@');
        return { name: `@${name}`, version };
      }
      const [name, version] = packageVersion.split('@');
      return { name, version };
    });
};

const getPackagesInfos = async (name, version) => {
  console.log(`- Retrieving infos for ${name}@${version}`);
  const { data } = await axios.get(
    `https://registry.npmjs.org/${name}/${version}`,
  );
  return data;
};

const shouldAddPackage = async (name, version, distPath) => {
  try {
    await access(
      path.resolve(path.join(distPath, name, version)),
      constants.R_OK,
    );
    return false;
  } catch (error) {
    return true;
  }
};

const downloadTarball = async (tarballURL, tarballName, downloadsPath) => {
  const writer = createWriteStream(path.join(downloadsPath, tarballName));

  console.log(`- Downloading ${tarballName} (${tarballURL})`);
  return axios
    .get(tarballURL, {
      responseType: 'stream',
    })
    .then((response) => {
      return new Promise((resolve, reject) => {
        response.data.pipe(writer);
        let error = null;
        writer.on('error', (err) => {
          error = err;
          writer.close();
          reject(err);
        });
        writer.on('close', () => {
          if (!error) {
            resolve(true);
          }
        });
      });
    });
};

const extractTarball = async (
  tarballName,
  downloads,
  { name, version },
  distPath,
) => {
  console.log(`- Extracing ${tarballName} in ${path.join(name, version)}`);

  await mkdir(path.join(distPath, name, version), { recursive: true });
  return createReadStream(path.resolve(downloads, tarballName))
    .on('error', console.log)
    .pipe(zlib.Unzip())
    .pipe(
      tar.extract({
        cwd: path.join(distPath, name, version),
        strip: 1,
      }),
    );
};

const buildCDNMock = async () => {
  const downloadsPath = path.resolve('./downloads');
  mkdir(downloadsPath);

  const distPath = path.resolve('./dist');

  const list = await getPackagesList();

  await Promise.all(
    list.map(async ({ name: packageName, version: packageVersion }) => {
      try {
        const { name, version, dist } = await getPackagesInfos(
          packageName,
          packageVersion,
        );

        const shouldAdd = await shouldAddPackage(name, version, distPath);

        if (!shouldAdd) {
          console.log(`# Skipping ${name}@${version}`);
        } else {
          const tarballName = path.basename(url.parse(dist.tarball).pathname);

          await downloadTarball(dist.tarball, tarballName, downloadsPath);
          await extractTarball(
            tarballName,
            downloadsPath,
            { name, version },
            distPath,
          );
        }
      } catch (error) {
        console.log(`Error on ${packageName}@${packageVersion}`);
      }
    }),
  );

  rm(downloadsPath, { recursive: true });
};

buildCDNMock();
