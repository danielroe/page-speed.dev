// @ts-expect-error virtual import
import inlineStyles from '#inline-styles'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (htmlContext) => {
    htmlContext.head.push(inlineStyles)
  })
})
