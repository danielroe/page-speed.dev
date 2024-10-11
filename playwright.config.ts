import { fileURLToPath } from 'node:url'
import { defineConfig } from '@playwright/test'
import type { ConfigOptions } from '@nuxt/test-utils/playwright'

export default defineConfig<ConfigOptions>({
  use: {
    // baseURL: 'https://page-speed.dev',
    nuxt: {
      rootDir: fileURLToPath(new URL('.', import.meta.url)),
      nuxtConfig: {
        nitro: {
          storage: {
            pagespeed: {
              driver: 'mock-driver',
            },
          },
        },
      },
    },
  },
})
