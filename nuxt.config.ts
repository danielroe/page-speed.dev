// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-og-image'],
  site: {
    url: 'https://page-speed.dev',
  },
  ogImage: {
    fonts: [
      'Roboto:500'
    ]
  }
})
