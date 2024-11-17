// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@unocss/nuxt',
    'nuxt-og-image',
    'nuxt-time',
    '@nuxtjs/plausible',
    '@nuxtjs/html-validator',
    '@nuxt/test-utils/module',
  ],
  $production: {
    routeRules: {
      '/**': {
        cache: {
          swr: true,
          maxAge: 24 * 60 * 60,
          staleMaxAge: 24 * 60 * 60,
        },
      },
    },
  },
  components: ['~/components/graphs', '~/components'],
  devtools: { enabled: true },
  site: {
    url: 'https://page-speed.dev',
  },
  runtimeConfig: {
    google: {
      apiToken: '',
    },
  },
  routeRules: {
    '/': { prerender: true, swr: true },
    '/api/**': { swr: false, cache: false },
    '/__og-image__/**': { swr: false, cache: false },
  },
  future: { compatibilityVersion: 4 },
  features: {
    inlineStyles: false,
  },
  experimental: {
    defaults: {
      useAsyncData: { deep: true },
    },
    appManifest: false,
    headNext: true,
    payloadExtraction: false,
  },
  compatibilityDate: '2024-09-12',
  nitro: {
    compressPublicAssets: {
      brotli: true,
      gzip: true,
    },
    azure: {
      config: {
        platform: {
          apiRuntime: 'node:18',
        },
      },
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  htmlValidator: {
    failOnError: true,
  },
  ogImage: {
    componentDirs: ['opengraph'],
    defaults: {
      cacheMaxAgeSeconds: 60 * 60 * 24,
    },
    fonts: ['Roboto:500'],
  },
  plausible: {
    domain: 'page-speed.dev',
    apiHost: 'https://v.roe.dev',
  },
  unocss: {
    rules: [
      ['min-h-screen', { 'min-height': '100vh' }, { layer: '_fallback' }],
    ],
  },
})
