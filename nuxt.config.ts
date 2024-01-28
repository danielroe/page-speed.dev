// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', 'nuxt-og-image'],
  site: {
    url: 'https://page-speed.dev',
  },
  nitro: {
    serveStatic: true,
    azure: {
      config: {
        platform: {
          apiRuntime: 'node:18'
        }
      }
    }
  },
  $production: {
    nitro: {
      storage: {
        pagespeed: {
          driver: 'azureStorageBlob',
          accountName: 'pagespeedcache'
        }
      }
    }
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
  routeRules: {
    '/': { redirect: 'https://pagespeed.web.dev/' },
    '/**': { swr: 600 },
    '/__og-image__/**': { swr: false, cache: false }
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
    fonts: [
      'Roboto:500'
    ]
  }
})
