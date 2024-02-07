<template>
  <div class="font-sans text-white min-h-screen min-w-screen flex flex-col items-start justify-start">
    <div class="flex flex-col justify-start mt-4 sm:mt-8 md:my-12 p-4 gap-8 md:gap-12 flex-grow max-w-full">
      <h1 class="flex flex-row gap-4 text-white text-3xl md:text-5xl">
        <span class="text-green-400">&raquo;</span>
        <TheDomainForm v-model:domain="domain" v-model:editing="editing" />
      </h1>
      <template v-if="!editing && domain">
        <template v-if="status === 'pending' || results">
          <div class="flex flex-row flex-wrap gap-4 lg:flex-row justify-around w-full">
            <CoreWebVitals v-if="status === 'pending' || results?.crux" :pass="results?.crux?.cwv"
              :lcp="results?.crux?.lcp" :cls="results?.crux?.cls" :inp="results?.crux?.inp"
              :loading="status === 'pending'" size="normal" show-p75 />
            <template v-else-if="results">
              <ProgressRing size="normal" :value="results.lighthouse.performance" caption="performance" />
              <ProgressRing size="normal" :value="results.lighthouse.accessibility" caption="accessibility" />
              <ProgressRing size="normal" :value="results.lighthouse.bestPractices" caption="best practices" />
              <ProgressRing size="normal" :value="results.lighthouse.seo" caption="SEO" />
            </template>
          </div>
          <LighthouseTable v-if="status === 'pending' || (results && results.crux)" :loading="status === 'pending'"
            v-bind="results?.lighthouse || {}" />
        </template>
        <div v-else-if="domain">
          No results could be fetched. Is it a valid domain?
        </div>
        <TheShareLink v-if="results" :domain="domain" :type="results.crux ? 'crux' : 'pagespeed-insights'"
          :timestamp="results.crux?.timestamp || results.lighthouse.timestamp" />
      </template>
    </div>
    <footer class="mt-auto p-3 text-gray-400">
      <a class="underline hover:text-green-400 focus:text-green-400 active:text-green-400"
        href="https://github.com/danielroe/page-speed.dev">source</a>
      &middot;
      made with ❤️ by <a class="underline hover:text-green-400 focus:text-green-400 active:text-green-400"
        href="https://x.com/danielcroe">
        @danielcroe
      </a>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import '@unocss/reset/tailwind-compat.css'
import { joinURL, withoutLeadingSlash } from 'ufo'

const route = useRoute()
const domain = computed(() => withoutLeadingSlash(route.path).toLowerCase().replace(/(\/|\?).*$/, '').trim())
const canonicalURL = computed(() => domain.value ? joinURL(`https://page-speed.dev`, domain.value) : 'https://page-speed.dev')

if (domain.value && !/^[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/g.test(domain.value)) {
  throw new Error('Invalid domain')
}

const editing = ref(!domain.value)

const { data: results, status, refresh } = await useAsyncData(async () => {
  const [lighthouse, crux] = await Promise.all([
    $fetch(`/api/run/${domain.value}`),
    $fetch(`/api/crux/${domain.value}`).catch(() => null)
  ])
  return { lighthouse, crux }
}, {
  watch: [domain],
  immediate: !!domain.value,
})

if (!domain.value) {
  watch(domain, () => refresh(), { once: true })
}

useFavicon(() => status.value !== 'pending' && !!domain.value && (results.value ? results.value.lighthouse.performance : 100))

useHead({
  title: () => domain.value ? domain.value : 'page-speed.dev',
})

useServerHead({
  htmlAttrs: {
    lang: 'en',
    class: 'bg-[#212121]'
  },
  link: [
    {
      rel: 'canonical',
      href: canonicalURL.value
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png'
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest'
    },
    {
      rel: 'mask-icon',
      href: '/safari-pinned-tab.svg',
      color: '#23c55e'
    },
  ],
  meta: [
    {
      name: 'msapplication-TileColor',
      content: '#23c55e'
    },
    {
      name: 'theme-color',
      content: '#ffffff'
    }
  ]
})

useServerSeoMeta({
  ogUrl: canonicalURL.value,
  twitterCard: 'summary_large_image',
  twitterSite: '@danielcroe',
})

if (!domain.value) {
  defineOgImageComponent('Home')
  useServerSeoMeta({
    description: 'See and share Core Web Vitals and Page Speed Insights results simply and easily.',
  })
} else if (results.value) {
  useServerSeoMeta({
    description:
      results.value?.crux
        ?
        `Core Web Vitals: ${results.value?.crux.cwv ? 'pass' : 'fail'} | ` +
        `LCP: ${results.value?.crux.lcp.caption} | ` +
        `CLS: ${results.value?.crux.cls.caption} | ` +
        `INP: ${results.value?.crux.inp.caption}`
        :
        `Performance: ${results.value?.lighthouse.performance} | ` +
        `Accessibility: ${results.value?.lighthouse.accessibility} | ` +
        `Best Practices: ${results.value?.lighthouse.bestPractices} | ` +
        `SEO: ${results.value?.lighthouse.seo}`
  })

  defineOgImageComponent('Lighthouse', {
    lighthouse: results.value.lighthouse,
    crux: results.value?.crux,
    domain: domain.value,
  })
}

</script>
