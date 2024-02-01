// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', 'nuxt-og-image', 'nuxt-time'],
  site: {
    url: 'https://page-speed.dev',
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
      '/': { prerender: true },
      '/**': {
        cache: {
          swr: true,
          maxAge: 60,
          staleMaxAge: 60,
        }
      },
      '/api/**': { swr: false, cache: false },
      '/__og-image__/**': { swr: false, cache: false }
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
  unocss: {
    webFonts: {
      fonts: {
        sans: ['Roboto'],
      }
    }
  },
  ogImage: {
    defaults: {
      cacheMaxAgeSeconds: 60 * 60 * 24
    },
    runtimeCacheStorage: {
      driver: 'azureStorageBlob',
      accountName: 'pagespeedcache',
      accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY
    },
    fonts: [
      {
        name: 'Roboto',
        weight: 500,
        path: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9vAw.ttf',
      }
    ]
  }
})
