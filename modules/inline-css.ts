import { addVitePlugin, createResolver, defineNuxtModule, useNuxt } from 'nuxt/kit'
import { defu } from 'defu'
import purgehtml from 'purgecss-from-html'
import { PurgeCSS } from 'purgecss'

export default defineNuxtModule({
  meta: {
    name: 'style-inlining',
  },
  setup () {
    const nuxt = useNuxt()
    const resolver = createResolver(import.meta.url)

    let css: string
    let cssFilename: string

    addVitePlugin({
      name: 'entry-css',
      writeBundle (_options, bundle) {
        for (const name in bundle) {
          const asset = bundle[name]
          if (asset.type === 'asset' && asset.fileName.match(/entry.*\.css$/)) {
            cssFilename = asset.fileName
            css = asset.source.toString()
            asset.source = ''
            return
          }
        }
      }
    })

    // Collect example routes
    nuxt.options.nitro.prerender = defu(nuxt.options.nitro.prerender, {
      routes: ['/roe.dev', '/atinux.com']
    })
    const htmlRoutes: string[] = []
    nuxt.hook('nitro:init', nitro => {
      nitro.hooks.hook('prerender:generate', async route => {
        if (!route.fileName?.endsWith('.html') || !route.contents) return
        htmlRoutes.push(route.contents)
        route.skip = true
      })
    })

    let extractedCSS = ''
    nuxt.hook('nitro:build:public-assets', async () => {
      [{ css: extractedCSS }] = await new PurgeCSS().purge({
        content: htmlRoutes.map(html => ({ raw: html, extension: 'html' })),
        css: [{ raw: css }],
        extractors: [{ extensions: ['html'], extractor: purgehtml }],
      })
    })

    nuxt.hook('build:manifest', manifest => {
      for (const key in manifest) {
        if (manifest[key].css) {
          manifest[key].css = []
        }
      }
    })

    // Add virtual entry to Nitro
    nuxt.options.nitro.virtual ||= {}
    nuxt.options.nitro.virtual['#inline-styles'] = () => `export default ${JSON.stringify(`<style>${extractedCSS}</style>`)}`

    nuxt.options.nitro.plugins ||= []
    nuxt.options.nitro.plugins.push(resolver.resolve('./inline-css/nitro-plugin'))
  }
})
