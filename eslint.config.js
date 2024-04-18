import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['components/opengraph/**'],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
})
