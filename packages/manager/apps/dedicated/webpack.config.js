const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const webpackConfig = require('@ovh-ux/manager-webpack-config');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

const cdnPackages = {
  'jquery@2.2.4': { var: '$', files: { js: 'dist/jquery.min.js' } },
  'angular@1.7.9': { var: 'angular', files: { js: 'angular.min.js' } },
  'angular-aria@1.7.9': {
    var: "'ngAria'",
    files: { js: 'angular-aria.min.js' },
  },
  'chart.js@2.9.3': {
    var: 'Chart',
    files: {
      js: 'dist/Chart.min.js',
    },
  },
  'chartjs-plugin-zoom@0.5.0': {
    var: 'Chart',
    files: {
      js: 'chartjs-plugin-zoom.min.js',
    },
  },
  'angular-chart.js@1.1.1': {
    var: "'chart.js'",
    files: { js: 'dist/angular-chart.min.js' },
  },
  'angular-cookies@1.7.9': {
    var: "'ngCookies'",
    files: { js: 'angular-cookies.min.js' },
  },
  'angular-dynamic-locale@0.1.37': {
    files: { js: 'dist/tmhDynamicLocale.min.js' },
    var: "'tmh.dynamicLocale'",
  },
  // 'angular-i18n@1.7.9': {},
  // 'angular-messages@1.7.9': {},
  'angular-qr@0.2.3': {
    var: "'ja.qr'",
    files: {
      js: 'angular-qr.min.js',
    },
  },
  'angular-resource@1.7.9': {
    var: "'ngResource'",
    files: { js: 'angular-resource.min.js' },
  },
  'angular-route@1.7.9': {
    var: "'ngRoute'",
    files: {
      js: 'angular-route.min.js',
    },
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
  'angular-ui-validate@1.2.3': {
    var: "'ui.validate'",
    files: {
      js: 'dist/validate.min.js',
    },
  },
  'angular-websocket@2.0.1': {
    var: "'ngWebSocket'",
    files: {
      js: 'dist/angular-websocket.min.js',
    },
  },
  'angular-xeditable@0.9.0': {
    var: "'xeditable'",
    files: {
      js: 'dist/js/xeditable.min.js',
    },
  },
  'angularjs-scroll-glue@2.2.0': {
    var: "'luegg.directives'",
    files: {
      js: 'src/scrollglue.js',
    },
  },
  // 'animate.css@3.7.2': {
  //   files: {
  //     css: 'animate.css',
  //   },
  // },
  'bloodhound-js@1.2.3': {
    var: 'Bloodhound',
    files: { js: 'dist/bloodhound.min.js' },
  },
  'bootstrap@3.3.7': {
    var: '$',
    files: { js: 'dist/js/bootstrap.min.js' },
  },

  'clipboard@2.0.6': {
    var: 'ClipboardJS',
    files: { js: 'dist/clipboard.min.js' },
  },
  'components-jqueryui@1.12.1': {
    var: '$',
    files: {
      js: 'jquery-ui.min.js',
    },
  },
  // 'core-js@3.6.5': {},
  // 'es6-shim@0.35.5': {},
  'filesize@3.6.1': {
    var: 'filesize',
    files: {
      js: 'lib/filesize.js',
    },
  },
  // 'flag-icon-css@3.4.5': {},
  'flatpickr@4.6.9': {
    files: { js: 'dist/flatpickr.min.js' },
    var: 'flatpickr',
  },
  // 'font-awesome@4.7.0': {},
  'international-phone-number@0.0.11': {
    var: "'internationalPhoneNumber'",
    files: { js: 'releases/international-phone-number.min.js' },
  },
  'ipaddr.js@1.9.1': {
    var: 'ipaddr',
    files: { js: 'ipaddr.min.js' },
  },

  'jquery.scrollto@1.4.14': {
    var: '$',
    files: { js: 'jquery.scrollTo.min.js' },
  },
  'jsurl@0.1.5': {
    var: 'JSURL',
    files: { js: 'lib/jsurl.js' },
  },
  'lodash@4.17.21': {
    var: '_',
    files: { js: 'lodash.js' },
  },
  'matchmedia-ng@1.0.8': {
    var: "'matchmedia-ng'",
    files: { js: 'matchmedia-ng.js' },
  },
  'microplugin@0.0.3': {
    var: 'MicroPlugin',
    files: { js: 'src/microplugin.js' },
  },
  'moment@2.24.0': { var: 'moment', files: { js: 'min/moment.min.js' } },
  'ng-ckeditor@2.0.5': {
    var: 'ng.ckeditor',
    files: { js: 'dist/ng-ckeditor.min.js' },
  },
  'oclazyload@1.1.0': {
    var: "'oc.lazyLoad'",
    files: { js: 'dist/ocLazyLoad.min.js' },
  },
  // 'office-ui-fabric-core@11.0.0': {},
  // 'ovh-manager-webfont@1.2.0': {},
  'ovh-ui-kit-bs@4.2.0': { files: { js: 'dist/js/bootstrap.js' }, var: '$' },
  'popper.js@1.16.1': {
    files: { js: 'dist/umd/popper.min.js' },
    var: 'Popper',
  },
  'punycode@1.4.1': {
    var: 'punycode',
    files: { js: 'punycode.js' },
  },
  // 'randexp@0.4.9': {
  //   var: '',
  //   files: { js: 'lib/randexp.js'}
  // },
  // 'regenerator-runtime@0.13.7': {},
  'u2f-api-polyfill@0.4.4': {
    var: 'u2f',
    files: { js: 'u2f-api-polyfill.js' },
  },
  'ui-select@0.19.8': {
    files: { js: 'dist/select.min.js' },
    var: "'ui.select'",
  },
  'urijs@1.19.2': {
    var: 'URI',
    files: { js: 'src/URI.min.js' },
  },
  'validator@13.7.0': {
    var: 'validator',
    files: { js: 'validator.min.js' },
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
  '@ovh-ux/ng-ovh-browser-alert@2.0.4': {
    var: "'ngOvhBrowserAlert'",
    files: { js: 'dist/umd/ng-ovh-browser-alert.js' },
  },
  '@ovh-ux/ng-ovh-doc-url@2.0.4': {
    var: "'ngOvhDocUrl'",
    files: { js: 'dist/umd/ng-ovh-doc-url.js' },
  },
  '@ovh-ux/ng-ovh-export-csv@2.0.4': {
    var: "'ngOvhExportCsv'",
    files: { js: 'dist/umd/ng-ovh-export-csv.js' },
  },
  '@ovh-ux/ng-ovh-feature-flipping@1.0.5': {
    files: { js: 'dist/umd/ng-ovh-feature-flipping.js' },
    var: "'ngOvhFeatureFlipping'",
  },
  '@ovh-ux/ng-ovh-http@5.0.4': {
    files: { js: 'dist/umd/ng-ovh-http.js' },
    var: "'ngOvhHttp'",
  },
  '@ovh-ux/ng-ovh-jquery-ui-draggable@2.0.4': {
    var: "'ngOvhJqueryUiDraggable'",
    files: { js: 'dist/umd/ng-ovh-jquery-ui-draggable.js' },
  },
  '@ovh-ux/ng-ovh-proxy-request@2.0.4': {
    files: { js: 'dist/umd/ng-ovh-proxy-request.js' },
    var: "'ngOvhProxyRequest'",
  },
  '@ovh-ux/ng-ovh-responsive-popover@5.0.6': {
    var: "'ngOvhResponsivePopover'",
    files: { js: 'dist/umd/ng-ovh-responsive-popover.js' },
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
  '@ovh-ux/ng-q-allsettled@2.0.4': {
    var: "'ngQAllSettled'",
    files: { js: 'dist/umd/ng-q-allsettled.js' },
  },
  '@ovh-ux/ng-tail-logs@2.0.7': {
    var: "'ngTailLogs'",
    files: { js: 'dist/umd/ng-tail-logs.js' },
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
  '@ovh-ux/ng-ovh-actions-menu@5.0.13': {
    var: "'ngOvhActionsMenu'",
    files: { js: 'dist/umd/ng-ovh-actions-menu.js' },
  },
  '@ovh-ux/ng-ovh-user-pref@2.0.4': {
    files: { js: 'dist/umd/ng-ovh-user-pref.js' },
    var: "'ngOvhUserPref'",
  },
  // '@ovh-ux/ng-ovh-utils@14.0.17': {
  //   var: "'ngOvhUtils'",
  //   files: { js: 'dist/umd/ng-ovh-utils.js' },
  // },
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
  '@ovh-ux/ng-ovh-otrs@9.2.7': {
    var: "'ngOvhOtrs'",
    files: { js: 'dist/umd/ng-ovh-otrs.js' },
  },
  '@ovh-ux/ng-pagination-front@10.1.0': {
    var: "'ngPaginationFront'",
    files: { js: 'dist/umd/ng-pagination-front.js' },
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

function foundNodeModulesFolder(checkedDir, cwd = '.') {
  if (fs.existsSync(`${cwd}/node_modules/${checkedDir}`)) {
    return path.relative(process.cwd(), `${cwd}/node_modules/${checkedDir}`);
  }

  if (path.resolve(cwd) !== '/') {
    return foundNodeModulesFolder(checkedDir, `${cwd}/..`);
  }

  return null;
}

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
      template: './client/app/index.html',
      basePath: './client/app',
      lessPath: ['./node_modules'],
      lessJavascriptEnabled: true,
      root: path.resolve(__dirname, './client/app'),
      assets: {
        files: [
          {
            from: path.resolve(__dirname, './client/**/*.html'),
            context: 'client/app',
          },
          {
            from: path.resolve(__dirname, './client/app/images/**/*.*'),
            context: 'client/app',
          },
          { from: path.resolve(__dirname, './client/assets'), to: 'assets' },
          { from: foundNodeModulesFolder('ckeditor'), to: 'ckeditor' },
          {
            from: foundNodeModulesFolder('angular-i18n'),
            to: 'resources/angular/i18n',
          },
          {
            from: `${foundNodeModulesFolder('flag-icon-css')}/flags`,
            to: 'flag-icon-css/flags',
          },
        ],
      },
    },
    env,
  );

  config.plugins.push(
    new webpack.DefinePlugin({
      WEBPACK_ENV: {
        production: JSON.stringify(env.production),
      },
    }),
  );

  // Extra config files
  const extras = glob.sync('./.extras/**/*.js');

  return merge(config, {
    entry: {
      main: path.resolve('./client/app/index.js'),
      ...(extras.length > 0 ? { extras } : {}),
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
    },
    resolve: {
      modules: [
        './node_modules',
        path.resolve(process.cwd(), './node_modules'),
        path.resolve(process.cwd(), '../../../../node_modules'),
      ],
      mainFields: ['module', 'browser', 'main'],
    },
    plugins: [
      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
        /de|en-gb|es|es-us|fr-ca|fr|it|pl|pt/,
      ),
      new webpack.ContextReplacementPlugin(
        /flatpicker[/\\]dist[/\\]l10n$/,
        /de|es|es|fr|it|pl|pt/,
      ),
      new webpack.DefinePlugin({
        __NG_APP_INJECTIONS__: getNgAppInjections(['EU', 'CA', 'US']),
        __NODE_ENV__: process.env.NODE_ENV
          ? `'${process.env.NODE_ENV}'`
          : '"development"',
      }),

      new HtmlWebpackTagsPlugin({
        tags: [],
        scripts: assetsConfig,
      }),
    ],
    optimization: {
      runtimeChunk: 'single',
    },
  });
};
