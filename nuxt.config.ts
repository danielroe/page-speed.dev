// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-09-12',
  devtools: { enabled: true },
  components: ['~/components/graphs', '~/components'],
  features: {
    inlineStyles: false,
  },
  modules: [
    '@nuxt/eslint',
    '@unocss/nuxt',
    'nuxt-og-image',
    'nuxt-time',
    '@nuxtjs/plausible',
    '@nuxtjs/html-validator',
  ],
  eslint: {
    config: {
      stylistic: true,
    },
  },
  unocss: {
    rules: [
      ['min-h-screen', { 'min-height': '100vh' }, { layer: '_fallback' }],
    ],
  },
  htmlValidator: {
    failOnError: true,
  },
  experimental: {
    defaults: {
      useAsyncData: { deep: true },
    },
    appManifest: false,
    headNext: true,
    payloadExtraction: false,
  },
  site: {
    url: 'https://page-speed.dev',
  },
  routeRules: {
    '/': { prerender: true, swr: true },
    '/api/**': { swr: false, cache: false },
    '/__og-image__/**': { swr: false, cache: false },
  },
  $production: {
    routeRules: {
      '/**': {
        cache: {
          base: 'pagespeed',
          swr: true,
          maxAge: 24 * 60 * 60,
          staleMaxAge: 24 * 60 * 60,
        },
      },
    },
  },
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
  runtimeConfig: {
    google: {
      apiToken: '',
    },
  },
  plausible: {
    domain: 'page-speed.dev',
    apiHost: 'https://v.roe.dev',
  },
  ogImage: {
    componentDirs: ['opengraph'],
    defaults: {
      cacheMaxAgeSeconds: 60 * 60 * 24,
    },
    fonts: ['Roboto:500'],
  },
})
