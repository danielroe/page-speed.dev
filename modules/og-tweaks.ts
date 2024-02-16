import { defineNuxtModule, useNuxt } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'og-tweaks',
  },
  setup() {
    const nuxt = useNuxt()

    nuxt.hook('modules:done', () => {
      nuxt.hook('components:dirs', (dirs) => {
        const ogCommunityTemplates = dirs.findIndex(i => typeof i !== 'string' && i.path.includes('components/Templates/Community'))
        if (ogCommunityTemplates !== -1)
          dirs.splice(ogCommunityTemplates, 1)
      })
    })
  },
})
