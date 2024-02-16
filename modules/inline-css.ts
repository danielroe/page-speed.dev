import { addVitePlugin, createResolver, defineNuxtModule, useNuxt } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'style-inlining',
  },
  setup() {
    const nuxt = useNuxt()
    const resolver = createResolver(import.meta.url)

    let css: string

    addVitePlugin({
      name: 'entry-css',
      writeBundle(_options, bundle) {
        for (const name in bundle) {
          const asset = bundle[name]
          if (asset.type === 'asset' && asset.fileName.match(/entry.*\.css$/)) {
            css = asset.source.toString()
            return
          }
        }
      },
    }, { server: false })

    nuxt.hook('build:manifest', (manifest) => {
      for (const key in manifest) {
        if (manifest[key].css)
          manifest[key].css = []
      }
    })

    // Add virtual entry to Nitro
    nuxt.options.nitro.virtual ||= {}
    nuxt.options.nitro.virtual['#inline-styles'] = () => `export default ${JSON.stringify(`<style>${css}</style>`)}`

    nuxt.options.nitro.plugins ||= []
    nuxt.options.nitro.plugins.push(resolver.resolve('./inline-css/nitro-plugin'))
  },
})
