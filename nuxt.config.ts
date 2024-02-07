// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components: ['~/components/graphs', '~/components'],
  modules: ['@unocss/nuxt', 'nuxt-og-image', 'nuxt-time', '@nuxtjs/plausible'],
  experimental: {
    appManifest: false,
    headNext: true,
    payloadExtraction: false,
  },
  site: {
    url: 'https://page-speed.dev',
  },
  routeRules: {
    '/': { prerender: true },
    '/_v/**': { proxy: 'https://v.roe.dev/**', swr: false, cache: false },
    '/api/**': { swr: false, cache: false },
    '/__og-image__/**': { swr: false, cache: false }
  },
  nitro: {
    azure: {
      config: {
        platform: {
          apiRuntime: 'node:18'
        }
      }
    },
  },
  $production: {
    nitro: {
      storage: {
        pagespeed: {
          driver: 'azureStorageBlob',
          accountName: 'pagespeedcache',
          accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY
        }
      }
    },
    routeRules: {
      '/**': {
        cache: {
          swr: true,
          maxAge: 60,
          staleMaxAge: 60,
        }
      },
    },
  },
  $development: {
    nitro: {
      storage: {
        pagespeed: {
          driver: 'fs',
          base: 'cache'
        }
      }
    }
  },
  runtimeConfig: {
    google: {
      apiToken: ''
    }
  },
  plausible: {
    domain: 'page-speed.dev',
    apiHost: '/_v',
  },
  ogImage: {
    defaults: {
      cacheMaxAgeSeconds: 60 * 60 * 24
    },
    runtimeCacheStorage: {
      driver: 'azureStorageBlob',
      accountName: 'pagespeedcache',
      accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY
      // containerName: 'images-v1'
    },
    fonts: ['Roboto:500']
  }
})
