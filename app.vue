<template>
  <div class="md:pl-[5vw] font-sans text-white min-h-screen min-w-screen flex flex-col items-start justify-start">
    <div v-if="showConfetti" v-confetti />
    <div class="flex flex-col justify-start mt-4 sm:mt-8 md:my-12 p-4 gap-8 md:gap-12 flex-grow max-w-full">
      <div class="flex flex-row gap-4 text-white text-3xl md:text-5xl">
        <span class="text-green-400">&raquo;</span>
        <TheDomainForm :domain="domain" v-model:editing="editing" />
      </div>
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
            about these results
          </summary>
          <p class="mt-4">
            This tool uses the <a class="underline hover:text-green-400 focus:text-green-400 active:text-green-400"
              href="https://developers.google.com/web/tools/chrome-user-experience-report">Chrome User Experience
              Report</a> and
            <a class="underline hover:text-green-400 focus:text-green-400 active:text-green-400"
              href="https://developers.google.com/web/tools/lighthouse">Lighthouse</a> APIs to fetch and display Core Web
            Vitals and PageSpeed Insights results.
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
        href="https://roe.dev">
        daniel roe
      </a>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import '@unocss/reset/tailwind-compat.css'
import { joinURL, withoutLeadingSlash } from 'ufo'
import { vConfetti } from '@neoconfetti/vue'

const route = useRoute()
const domain = computed(() => withoutLeadingSlash(route.path).toLowerCase().replace(/(\/|\?).*$/, '').trim())
const hasValidDomain = computed(() => !!domain.value && isValidDomain(domain.value))
const canonicalURL = computed(() => domain.value ? joinURL(`https://page-speed.dev`, domain.value) : 'https://page-speed.dev')

const editing = ref(!domain.value)
const { data: crux, status: cruxStatus } = await useAsyncData(() => $fetch(`/api/crux/${domain.value}`), {
  watch: [hasValidDomain],
  immediate: hasValidDomain.value,
})

const { data: lighthouse, status: lighthouseStatus, refresh: lighthouseRefresh } = await useAsyncData(() => $fetch(`/api/run/${domain.value}`), {
  watch: [hasValidDomain],
  immediate: hasValidDomain.value,
  server: false,
})

const keys = ['performance', 'accessibility', 'bestPractices', 'seo'] as const
const showConfetti = computed(() => {
  // CWV fail, but ignore if there is now CrUX data
  if (cruxStatus.value !== 'pending' && crux.value && !crux.value.cwv) {
    return false
  }
  return lighthouse.value && keys.every(key => lighthouse.value![key] === 100)
})

useFavicon(() => lighthouseStatus.value !== 'pending' && !!hasValidDomain.value && (lighthouse.value ? lighthouse.value.performance : 100))

useHead({
  title: () => hasValidDomain.value ? domain.value : 'page-speed.dev',
})

useServerHead({
  htmlAttrs: {
    lang: 'en',
    class: 'bg-[#212121]'
  },
  bodyAttrs: {
    // @ts-expect-error allow escaping focus from tooltips on mobile
    tabindex: '0'
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
  ogTitle: hasValidDomain.value ? domain.value : 'page-speed.dev',
  ogUrl: canonicalURL.value,
  twitterTitle: hasValidDomain.value ? domain.value : 'page-speed.dev',
  twitterCard: 'summary_large_image',
  twitterSite: '@danielcroe',
})

if (!hasValidDomain.value) {
  defineOgImageComponent('Home')
  useServerSeoMeta({
    description: 'See and share Core Web Vitals and PageSpeed Insights results simply and easily.',
    ogDescription: 'See and share Core Web Vitals and PageSpeed Insights results simply and easily.',
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
