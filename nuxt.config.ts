// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', 'nuxt-og-image'],
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
    }
  },
  // $production: {
  //   nitro: {
  //     storage: {
  //       pagespeed: {
  //         driver: 'azureStorageBlob',
  //         accountName: 'pagespeedcache'
  //       }
  //     }
  //   }
  // },
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
    '/**': { swr: 24 * 60 * 60 },
    '/api': {
      cache: {
        base: 'pagespeed',
        swr: true,
        maxAge: 60 * 60,
        staleMaxAge: 24 * 60 * 60,
      }
    },
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
    defaults: {
      cacheMaxAgeSeconds: 60 * 60 * 24
    },
    // runtimeCacheStorage: {
    //   driver: 'azureStorageBlob',
    //   accountName: 'pagespeedcache'
    // },
    fonts: [
      {
        name: 'Roboto',
        weight: 500,
        path: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9vAw.ttf',
      }
    ]
  }
})
