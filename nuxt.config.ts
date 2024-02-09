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
    '/api/**': { swr: false, cache: false },
    '/__og-image__/**': { swr: false, cache: false }
  },
  $production: {
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
  nitro: {
    azure: {
      config: {
        platform: {
          apiRuntime: 'node:18'
        }
      }
    },
  },
  runtimeConfig: {
    google: {
      apiToken: ''
    }
  },
  plausible: {
    domain: 'page-speed.dev',
    apiHost: 'https://v.roe.dev',
  },
  ogImage: {
    componentDirs: ['opengraph'],
    defaults: {
      cacheMaxAgeSeconds: 60 * 60 * 24
    },
    fonts: ['Roboto:500']
  }
})
