#! /usr/bin/env node
/* eslint-disable no-console */

const { default: axios } = require('axios');
const path = require('path');
const { readFile, writeFile } = require('fs/promises');

const getPackagesInfos = async (name, version) => {
  console.log(`- Retrieving infos for ${name}@${version}`);
  const { data } = await axios.get(
    `https://registry.npmjs.org/${name}/${version}`,
  );
  return data;
};

const getPackage = (packageName, packageVersion) => {
  if (!packageVersion) {
    if (packageName.startsWith('@')) {
      const [, name, version] = packageName.split('@');
      return { name: `@${name}`, version };
    }
    const [name, version] = packageName.split('@');
    return { name, version };
  }
  return { name: packageName, version: packageVersion };
};

const addPackage = async (packageInfos) => {
  const { name, version } = await getPackagesInfos(
    packageInfos.name,
    packageInfos.version,
  );

  // test si existe dans le fichiers
  const packageListFilepath = path.resolve('packages-list.txt');
  const packages = await readFile(packageListFilepath, 'utf-8');

  if (packages.includes(`${name}@${version}`)) {
    console.log(`${name}@${version} already present`);
    return;
  }
  const list = packages.split('\n').filter((l) => !!l);
  list.push(`${name}@${version}`);

  await writeFile(packageListFilepath, list.sort().join('\n'));

  console.log(`- ${name}@${version} added`);
};

const [, , packageName, packageVersion] = process.argv;
addPackage(getPackage(packageName, packageVersion));
