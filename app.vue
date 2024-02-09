<template>
  <div class="md:pl-[5vw] font-sans text-white min-h-screen min-w-screen flex flex-col items-start justify-start">
    <div class="flex flex-col justify-start mt-4 sm:mt-8 md:my-12 p-4 gap-8 md:gap-12 flex-grow max-w-full">
      <h1 class="flex flex-row gap-4 text-white text-3xl md:text-5xl">
        <span class="text-green-400">&raquo;</span>
        <TheDomainForm v-model:domain="domain" v-model:editing="editing" />
      </h1>
      <template v-if="!editing && domain">
        <template v-if="cruxStatus === 'pending' || lighthouseStatus === 'pending' || crux || lighthouse">
          <div class="flex flex-row flex-wrap gap-4 lg:flex-row justify-around w-full">
            <CoreWebVitals v-if="cruxStatus === 'pending' || crux" :pass="crux?.cwv" :lcp="crux?.lcp" :cls="crux?.cls"
              :inp="crux?.inp" :loading="cruxStatus === 'pending'" size="normal" show-p75 />
            <template v-else>
              <ProgressRing size="normal" :value="lighthouseStatus !== 'pending' && lighthouse?.performance"
                caption="performance" />
              <ProgressRing size="normal" :value="lighthouseStatus !== 'pending' && lighthouse?.accessibility"
                caption="accessibility" />
              <ProgressRing size="normal" :value="lighthouseStatus !== 'pending' && lighthouse?.bestPractices"
                caption="best practices" />
              <ProgressRing size="normal" :value="lighthouseStatus !== 'pending' && lighthouse?.seo" caption="SEO" />
            </template>
          </div>
          <LighthouseTable v-if="cruxStatus === 'pending' || crux"
            :loading="lighthouseStatus === 'pending' || !lighthouse" v-bind="lighthouse || {}" />
        </template>
        <div v-else-if="domain">
          No results could be fetched. Is it a valid domain?
        </div>
        <TheShareLink v-if="crux || lighthouse" :domain="domain" :type="crux ? 'crux' : 'pagespeed-insights'"
          :timestamp="crux && cruxStatus !== 'pending' ? crux.timestamp : lighthouse && lighthouseStatus !== 'pending' ? lighthouse.timestamp : undefined" />
        <details class="max-w-[500px] text-gray-400">
          <summary class="cursor-pointer">
            About these results
          </summary>
          <p class="mt-4">
            This tool uses the <a class="underline hover:text-green-400 focus:text-green-400 active:text-green-400"
              href="https://developers.google.com/web/tools/chrome-user-experience-report">Chrome User Experience
              Report</a> and
            <a class="underline hover:text-green-400 focus:text-green-400 active:text-green-400"
              href="https://developers.google.com/web/tools/lighthouse">Lighthouse</a> APIs to fetch and display Core Web
            Vitals and Page Speed Insights results.
          </p>
          <p class="mt-4">
            Results are cached for a minimum of one day plus the first following request.
          </p>
          <p class="mt-4">
            The numbers you see are for <b>mobile devices</b>.
          </p>
        </details>
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

const { data: crux, status: cruxStatus, refresh: cruxRefresh } = await useFetch(() => `/api/crux/${domain.value}`, {
  key: 'crux',
  immediate: !!domain.value,
})

const { data: lighthouse, status: lighthouseStatus, refresh: lighthouseRefresh } = await useFetch(() => `/api/run/${domain.value}`, {
  key: 'lighthouse',
  immediate: !!domain.value,
  server: false,
})

if (!domain.value) {
  watch(domain, () => [lighthouseRefresh(), cruxRefresh()], { once: true })
}

useFavicon(() => lighthouseStatus.value !== 'pending' && !!domain.value && (lighthouse.value ? lighthouse.value.performance : 100))

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
  ogTitle: domain.value ? domain.value : 'page-speed.dev',
  ogUrl: canonicalURL.value,
  twitterTitle: domain.value ? domain.value : 'page-speed.dev',
  twitterCard: 'summary_large_image',
  twitterSite: '@danielcroe',
})

if (!domain.value) {
  defineOgImageComponent('Home')
  useServerSeoMeta({
    description: 'See and share Core Web Vitals and Page Speed Insights results simply and easily.',
    ogDescription: 'See and share Core Web Vitals and Page Speed Insights results simply and easily.',
  })
} else {
  if (!crux.value) await lighthouseRefresh()
  if (crux.value || lighthouse.value) {
    const description = crux.value
      ?
      `Core Web Vitals ${crux.value?.cwv ? 'pass' : 'fail'}: ` +
      `LCP: ${crux.value?.lcp.caption} | ` +
      `CLS: ${crux.value?.cls.caption} | ` +
      `INP: ${crux.value?.inp.caption}`
      :
      `Performance: ${lighthouse.value!.performance} | ` +
      `Accessibility: ${lighthouse.value!.accessibility} | ` +
      `Best Practices: ${lighthouse.value!.bestPractices} | ` +
      `SEO: ${lighthouse.value!.seo}`

    useServerSeoMeta({
      description,
      ogDescription: description,
    })

    defineOgImageComponent('Lighthouse', {
      domain: domain.value,
    })
  }
}

</script>
