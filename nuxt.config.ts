// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', 'nuxt-og-image'],
  site: {
    url: 'https://page-speed.dev',
  },
  routeRules: {
    '/': { redirect: 'https://pagespeed.web.dev/' },
    '/**': { swr: 600 }
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
