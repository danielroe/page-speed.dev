import process from 'node:process'
import { defineNuxtModule, useNuxt } from 'nuxt/kit'
import { defu } from 'defu'

export default defineNuxtModule({
  meta: {
    name: 'azure-blob-cache',
  },
  setup() {
    const nuxt = useNuxt()

    if (process.env.AZURE_STORAGE_ACCOUNT_KEY && !nuxt.options.dev) {
      nuxt.options.nitro = defu(nuxt.options.nitro, {
        storage: {
          pagespeed: {
            driver: 'azureStorageBlob',
            accountName: 'pagespeedcache',
            accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
          },
        },
      })
      nuxt.options.ogImage = defu(nuxt.options.ogImage, {
        runtimeCacheStorage: {
          driver: 'azureStorageBlob',
          accountName: 'pagespeedcache',
          accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
          // containerName: 'images-v1'
        },
      })
    }
    if (nuxt.options.dev) {
      nuxt.options.nitro = defu(nuxt.options.nitro, {
        storage: {
          pagespeed: {
            driver: 'fs',
            base: 'cache',
          },
        },
      })
    }
  },
})
