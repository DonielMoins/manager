const fs = require('fs');
const glob = require('glob');
const path = require('path');
const webpack = require('webpack'); // eslint-disable-line
const merge = require('webpack-merge');
const webpackConfig = require('@ovh-ux/manager-webpack-config');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

const cdnPackages = {
  'jquery@2.2.4': { var: '$', files: { js: 'dist/jquery.min.js' } },
  'angular@1.7.9': { var: 'angular', files: { js: 'angular.min.js' } },
  'angular-animate@1.7.9': {
    files: { js: 'angular-animate.min.js' },
    var: "'ngAnimate'",
  },
  'angular-aria@1.7.9': {
    var: "'ngAria'",
    files: { js: 'angular-aria.min.js' },
  },
  'angular-cookies@1.7.9': {
    var: "'ngCookies'",
    files: { js: 'angular-cookies.min.js' },
  },
  'angular-dynamic-locale@0.1.37': {
    files: { js: 'dist/tmhDynamicLocale.min.js' },
    var: "'tmh.dynamicLocale'",
  },
  'angular-resource@1.7.9': {
    var: "'ngResource'",
    files: { js: 'angular-resource.min.js' },
  },
  'angular-sanitize@1.7.9': {
    files: { js: 'angular-sanitize.min.js' },
    var: "'ngSanitize'",
  },
  'angular-translate@2.18.1': {
    files: { js: 'dist/angular-translate.js' },
    var: "'pascalprecht.translate'",
  },
  'angular-translate-loader-pluggable@1.3.1': {
    files: { js: 'dist/angular-translate-loader-pluggable.min.js' },
    var: "'angular-translate-loader-pluggable'",
  },
  'angular-ui-bootstrap@1.3.3': {
    files: { js: 'dist/ui-bootstrap.js' },
    var: "'ui.bootstrap'",
  },
  'bloodhound-js@1.2.3': {
    files: { js: 'dist/bloodhound.min.js' },
    var: 'Bloodhound',
  },
  'bootstrap@3.3.7': {
    files: { js: 'dist/js/bootstrap.min.js' },
    var: '$',
  },
  'clipboard@2.0.6': {
    var: 'ClipboardJS',
    files: { js: 'dist/clipboard.min.js' },
  },
  'flatpickr@4.6.9': {
    files: { js: 'dist/flatpickr.min.js' },
    var: 'flatpickr',
  },
  'moment@2.24.0': { var: 'moment', files: { js: 'min/moment.min.js' } },
  'oclazyload@1.1.0': {
    var: "'oc.lazyLoad'",
    files: { js: 'dist/ocLazyLoad.min.js' },
  },
  'ovh-ui-kit-bs@4.2.0': { files: { js: 'dist/js/bootstrap.js' }, var: '$' },
  'popper.js@1.16.1': {
    files: { js: 'dist/umd/popper.min.js' },
    var: 'Popper',
  },
  'ui-select@0.19.8': {
    files: { js: 'dist/select.min.js' },
    var: "'ui.select'",
  },
  'whatwg-fetch@3.6.2': { files: { js: 'dist/fetch.umd.js' }, var: 'fetch' },
  '@ovh-ux/ng-at-internet@5.9.1': {
    files: { js: 'dist/umd/ng-at-internet.js' },
    var: "'ngAtInternet'",
  },
  '@ovh-ux/ng-ovh-api-wrappers@5.0.0': {
    var: "'ngOvhApiWrappers'",
    files: {
      js: 'dist/umd/ng-ovh-api-wrappers.js',
    },
  },
  '@ovh-ux/ng-ovh-feature-flipping@1.0.5': {
    files: { js: 'dist/umd/ng-ovh-feature-flipping.js' },
    var: "'ngOvhFeatureFlipping'",
  },
  '@ovh-ux/ng-ovh-http@5.0.4': {
    files: { js: 'dist/umd/ng-ovh-http.js' },
    var: "'ngOvhHttp'",
  },
  '@ovh-ux/ng-ovh-proxy-request@2.0.4': {
    files: { js: 'dist/umd/ng-ovh-proxy-reques.js' },
    var: "'ngOvhProxyRequest'",
  },
  '@ovh-ux/ng-ovh-sso-auth@4.6.2': {
    files: { js: 'dist/umd/ng-ovh-sso-auth.js' },
    var: "'ngOvhSsoAuth'",
  },
  '@ovh-ux/ng-ovh-swimming-poll@5.0.5': {
    var: "'ngOvhSwimmingPoll'",
    files: {
      js: 'dist/umd/ng-ovh-swimming-poll.js',
    },
  },
  '@ovh-ux/ng-translate-async-loader@2.1.4': {
    files: { js: 'dist/umd/ng-translate-async-loader.js' },
    var: "'ngTranslateAsyncLoader'",
  },

  '@uirouter/angularjs@1.0.23': {
    var: "'ui.router'",
    files: { js: 'release/angular-ui-router.min.js' },
  },
  '@ovh-ux/ng-at-internet-ui-router-plugin@3.2.1': {
    files: { js: 'dist/umd/ng-at-internet-ui-router-plugin.js' },
    var: "'ngAtInternetUiRouterPlugin'",
  },
  '@ovh-ux/ng-ovh-user-pref@2.0.4': {
    files: { js: 'dist/umd/ng-ovh-user-pref.js' },
    var: "'ngOvhUserPref'",
  },
  '@ovh-ux/ng-ui-router-breadcrumb@1.1.6': {
    files: { js: 'dist/umd/ng-ui-router-breadcrumb.js' },
    var: "'ngUiRouterBreadcrumb'",
  },
  '@ovh-ux/ui-kit@6.1.0': {
    var: "'oui'",
    files: { js: 'dist/js/oui.js' },
  },
  'ovh-api-services@16.0.0': {
    var: "'ovh-api-services'",
    files: { js: 'dist/umd/ovh-api-services.js' },
  },
  '@ovh-ux/ng-ovh-contracts@4.2.0': {
    files: { js: 'dist/umd/ng-ovh-contracts.js' },
    var: "'ngOvhContracts'",
  },
  '@ovh-ux/ng-ui-router-layout@4.1.0': {
    files: { js: 'dist/umd/ng-ui-router-layout.js' },
    var: "'ngUiRouterLayout'",
  },
};

const assetsConfig = Object.keys(cdnPackages).reduce((all, cdnPackage) => {
  let packageName;
  let packageVersion;
  if (cdnPackage.startsWith('@')) {
    [, packageName, packageVersion] = cdnPackage.split('@');
    packageName = `@${packageName}`;
  } else {
    [packageName, packageVersion] = cdnPackage.split('@');
  }

  const packageInfos = cdnPackages[cdnPackage];
  return [
    ...all,
    {
      path: `/static/${packageName}/${packageVersion}/${packageInfos.files.js}`,
      external: {
        packageName,
        variableName: packageInfos.var,
      },
      attributes: {
        type: 'text/javascript',
      },
    },
  ];
}, []);

function readNgAppInjections(file) {
  let injections = [];
  if (fs.existsSync(file)) {
    injections = fs
      .readFileSync(file, 'utf8')
      .split('\n')
      .filter((value) => value !== '');
  }
  return injections;
}

function getNgAppInjections(regions) {
  return regions.reduce((ngAppInjections, region) => {
    const injections = [
      ...readNgAppInjections(`./.extras-${region}/ng-app-injections`),
      ...readNgAppInjections('./.extras/ng-app-injections'),
    ];

    return {
      ...ngAppInjections,
      [region]: JSON.stringify(injections),
    };
  }, {});
}

module.exports = (env = {}) => {
  const { config } = webpackConfig(
    {
      template: './src/index.html',
      basePath: './src',
      lessPath: ['./node_modules'],
      root: path.resolve(__dirname, './src'),
      assets: {
        files: [
          {
            from: path.resolve(__dirname, './src/assets/images'),
            to: 'assets/images/',
          },
        ],
      },
    },
    env,
  );

  // Extra config files
  const extras = glob.sync(`./.extras/**/*.js`);

  return merge(config, {
    entry: {
      main: path.resolve('./src/index.js'),
      ...(extras.length > 0 ? { extras } : {}),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
    },
    resolve: {
      modules: [
        './node_modules',
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, '../../../node_modules'),
      ],
      mainFields: ['module', 'browser', 'main'],
    },
    plugins: [
      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
        /de|en-gb|es|es-us|fr-ca|fr|it|pl|pt/,
      ),

      new webpack.DefinePlugin({
        __NODE_ENV__: process.env.NODE_ENV
          ? `'${process.env.NODE_ENV}'`
          : '"development"',
        __NG_APP_INJECTIONS__: getNgAppInjections(['EU', 'CA', 'US']),
      }),

      new HtmlWebpackTagsPlugin({
        tags: [],
        scripts: assetsConfig,
      }),
    ],
  });
};
