/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js
require('dotenv').config()
const { configure } = require('quasar/wrappers')
const path = require('path')

module.exports = configure(function (/* ctx */) {
  return {
    eslint: {
      // fix: true,
      // include = [],
      // exclude = [],
      // rawOptions = {},
      warnings: true,
      errors: true,
    },

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ['router', 'i18n', 'axios', 'components', 'konva'],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ['app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
      'material-icons-round',
      'material-symbols-outlined',
      'material-symbols-rounded',
      'material-symbols-sharp',
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      alias: {
        css: path.join(__dirname, 'src/core/css'),
        components: path.join(__dirname, 'src/core/components'),
        composables: path.join(__dirname, '/src/core/composables'),
        utils: path.join(__dirname, 'src/core/utils'),
        stores: path.join(__dirname, 'src/core/stores'),
        types: path.join(__dirname, 'src/core/types'),
        modules: path.join(__dirname, 'src/modules'),
        pages: path.join(__dirname, 'src/pages'),
      },
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16',
      },

      vueRouterMode: 'history', // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      // analyze: true,
      env: {
        BASE_API_URL: process.env.BASE_API_URL,
        NODE_ENV: process.env.NODE_ENV,
        LOCATION: process.env.LOCATION,
        PROFILE: process.env.PROFILE,
        AWS_REGION_CONFIG: process.env.AWS_REGION_CONFIG,
        AWS_S3_STORAGE_BUCKET_NAME: process.env.AWS_S3_STORAGE_BUCKET_NAME,
        AWS_S3_USER_HEAD_IMAGE_BUCKET_NAME:
          process.env.AWS_S3_USER_HEAD_IMAGE_BUCKET_NAME,
        AWS_S3_USER_PROCESSED_HEAD_IMAGE_BUCKET_NAME:
          process.env.AWS_S3_USER_PROCESSED_HEAD_IMAGE_BUCKET_NAME,
        AWS_S3_USER_ANALYSIS_APPLICATION_STORAGE_BUCKET_NAME:
          process.env.AWS_S3_USER_ANALYSIS_APPLICATION_STORAGE_BUCKET_NAME,
        IS_DESK_RELEASED: process.env.IS_DESK_RELEASED,
        CHAT_HOST: process.env.CHAT_HOST,
        CHAT_PORT: process.env.CHAT_PORT,
        DECOMPRESS_FILE_SIZE_LIMIT: process.env.DECOMPRESS_FILE_SIZE_LIMIT,
        ENCRYPT_FILE_SIZE_LIMIT: process.env.ENCRYPT_FILE_SIZE_LIMIT,
        DECRYPT_FILE_SIZE_LIMIT: process.env.DECRYPT_FILE_SIZE_LIMIT,
        AMAZON_PAY_URL: process.env.AMAZON_PAY_URL,
        AMAZON_PAY_CLIENT_ID: process.env.AMAZON_PAY_CLIENT_ID,
        AMAZON_PAY_SELLER_ID: process.env.AMAZON_PAY_SELLER_ID,
        AMAZON_PAY_MERCHANT_ID: process.env.AMAZON_PAY_MERCHANT_ID,
        AMAZON_STORE_ID: process.env.AMAZON_STORE_ID,
        AMAZON_PUBLIC_KEY_ID: process.env.AMAZON_PUBLIC_KEY_ID,
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      },
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      // extendViteConf (viteConf) {},
      // viteVuePluginOptions: {},
      // viteVuePluginOptions: {
      //   template: {
      //     compilerOptions: {
      //       isCustomElement: (tag) => tag.startsWith('aq-')
      //     }
      //   }
      // },
      vitePlugins: [
        [
          '@intlify/vite-plugin-vue-i18n',
          {
            // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
            // compositionOnly: false,

            // you need to set i18n resource including paths !
            include: path.resolve(__dirname, './src/core/i18n/**'),
          },
        ],
      ],
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      // https: true
      // open: true, // opens browser window automatically
      port: 9000,
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {
        notify: {
          position: 'top-right',
        },
      },
      cssAddon: true,

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ['Notify', 'Dialog'],
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    sourceFiles: {
      rootComponent: 'src/app.vue',
      router: 'src/core/router/index',
      store: 'src/core/stores/index',
      //   registerServiceWorker: 'src-pwa/register-service-worker',
      //   serviceWorker: 'src-pwa/custom-service-worker',
      //   pwaManifestFile: 'src-pwa/manifest.json',
      //   electronMain: 'src-electron/electron-main',
      //   electronPreload: 'src-electron/electron-preload'
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        'render', // keep this as last one
      ],
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'generateSW', // or 'injectManifest'
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      // useFilenameHashes: true,
      // extendGenerateSWOptions (cfg) {}
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      inspectPort: 5858,

      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'atlas-webclient-zen',
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: ['my-content-script'],

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    },
  }
})
