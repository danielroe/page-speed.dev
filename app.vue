<template>
  <div class="font-sans text-white min-h-screen min-w-screen flex flex-col items-start justify-start">
    <div class="flex flex-col justify-start mt-4 sm:mt-8 md:my-12 p-4 gap-8 md:gap-12 flex-grow max-w-full">
      <h1 class="flex flex-row gap-4 text-white text-3xl md:text-5xl">
        <span class="text-green-400">&raquo;</span>
        <button v-if="domain && !editing" class="bg-transparent" @click="enableEditing">{{ domain }}</button>
        <form v-else class="flex flex-col gap-4 overflow-hidden" @submit.prevent="navigateToNewDomain">
          <input ref="input" v-model="newDomain" name="domain" type="text"
            class="md:-mt-1 rounded-none py-0 bg-transparent outline-none border-b-2 border-b-solid border-transparent focus:border-green-500 underline-dashed"
            autofocus inputmode="url" autocapitalize="none" placeholder="Enter a domain" required />
          <button type="submit"
            class="bg-green-400 text-black hover: hover:bg-white focus:bg-white active:bg-white text-xl md:text-2xl py-2 px-6 md:self-start">See
            results</button>
        </form>
      </h1>
      <template v-if="!editing && domain">
        <template v-if="status === 'pending' || results">
          <div class="flex flex-row flex-wrap gap-4 lg:flex-row justify-around w-full">
            <template v-if="status === 'pending' || results?.crux">
              <Histogram v-if="results?.crux?.cwv" size="normal" caption="core vitals" :value="{ caption: '', segments: [100, 100, 100] }">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-green-500" width="6rem" height="6rem" viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="m10 13.6l5.9-5.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-6.6 6.6q-.3.3-.7.3t-.7-.3l-2.6-2.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275z" />
                </svg>
              </Histogram>
              <Histogram v-else-if="status !== 'pending'" size="normal"
                caption="core vitals" 
                :value="{ caption: '', segments: [100] }">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-red-500" width="6rem" height="6rem"  viewBox="0 0 24 24"><path fill="currentColor" d="M16.066 8.995a.75.75 0 1 0-1.06-1.061L12 10.939L8.995 7.934a.75.75 0 1 0-1.06 1.06L10.938 12l-3.005 3.005a.75.75 0 0 0 1.06 1.06L12 13.06l3.005 3.006a.75.75 0 0 0 1.06-1.06L13.062 12z"/></svg>
              </Histogram>
              <Histogram v-else size="normal"
                caption="core vitals" 
                :value="undefined" />
              <Histogram size="normal" :value="results?.crux && status !== 'pending' ? results.crux.lcp : undefined"
                caption="LCP" />
              <Histogram size="normal" :value="results?.crux && status !== 'pending' ? results.crux.cls : undefined"
                caption="CLS" />
              <Histogram size="normal" :value="results?.crux && status !== 'pending' ? results.crux.inp : undefined"
                caption="INP" />
            </template>
            <template v-else-if="results">
              <ProgressRing size="normal" :value="results.lighthouse.performance" caption="performance" />
              <ProgressRing size="normal" :value="results.lighthouse.accessibility" caption="accessibility" />
              <ProgressRing size="normal" :value="results.lighthouse.bestPractices" caption="best practices" />
              <ProgressRing size="normal" :value="results.lighthouse.seo" caption="SEO" />
            </template>
          </div>
          <div v-if="status === 'pending' || (results && results.crux)"
            class="flex flex-row flex-wrap gap-4 lg:flex-row justify-around w-full border border-green-700 border-2 rounded-lg p-4">
            <span class="flex flex-row gap-2">
              <span class="font-bold">{{ results && status !== 'pending' ? results.lighthouse.performance.toFixed(0) :
                undefined
              }}</span>
              <span>performance</span>
            </span>
            <span class="flex flex-row gap-2">
              <span class="font-bold">{{ results && status !== 'pending' ? results.lighthouse.accessibility.toFixed(0) :
                undefined
              }}</span>
              <span>accessibility</span>
            </span>
            <span class="flex flex-row gap-2">
              <span class="font-bold">{{ results && status !== 'pending' ? results.lighthouse.bestPractices.toFixed(0) :
                undefined
              }}</span>
              <span>best practices</span>
            </span>
            <span class="flex flex-row gap-2">
              <span class="font-bold">{{ results && status !== 'pending' ? results.lighthouse.seo.toFixed(0) : undefined
              }}</span>
              <span>SEO</span>
            </span>
          </div>
        </template>
        <div v-else-if="domain">
          No results could be fetched. Is it a valid domain?
        </div>
        <div class="flex flex-col gap-2 mt-auto md:mt-8">
          <NuxtLink type="submit"
            class="bg-green-400 text-black hover: hover:bg-white focus:bg-white active:bg-white text-xl md:text-2xl py-2 px-6 md:self-start mb-8"
            :href="shareLink" @click.prevent="nativeShare">
            Share results
          </NuxtLink>
          <a v-if="results?.crux"
            :href="`https://lookerstudio.google.com/c/u/0/reporting/bbc5698d-57bb-4969-9e07-68810b9fa348/page/keDQB?params=%7B%22origin%22:%22https://${domain}%22%7D`"
            class="self-start underline text-gray-400 hover:text-green-400 focus:text-green-400 active:text-green-400">
            Explore full results in the CrUX Dashboard &raquo;
          </a>
          <a v-else :href="`https://pagespeed.web.dev/analysis?url=https://${domain}`"
            class="self-start underline text-gray-400 hover:text-green-400 focus:text-green-400 active:text-green-400">
            See full results on PageSpeed Insights &raquo;
          </a>
          <span v-if="results?.crux?.timestamp || results?.lighthouse?.timestamp" class="text-gray-400">
            Last updated at
            <NuxtTime :datetime="results.crux?.timestamp || results.lighthouse.timestamp" dateStyle="full"
              timeStyle="medium" />.
          </span>
        </div>
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
import { joinURL, withoutLeadingSlash, parseURL } from 'ufo'

const route = useRoute()
const domain = computed(() => withoutLeadingSlash(route.path).toLowerCase().replace(/(\/|\?).*$/, '').trim())
const canonicalURL = computed(() => domain.value ? joinURL(`https://page-speed.dev`, domain.value) : 'https://page-speed.dev')

if (domain.value && !/^[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/g.test(domain.value)) {
  throw new Error('Invalid domain')
}

const editing = ref(!domain.value)
const newDomain = ref('')
const input = ref<HTMLInputElement>()

function enableEditing () {
  newDomain.value = domain.value
  editing.value = true
  watch(input, (input) => {
    if (input) {
      input.focus()
      input.setSelectionRange(0, newDomain.value.length)
    }
  }, { once: true })
}

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

const favicon = computed(() => {
  const radius = 80
  const stroke = 14
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI

  const value = status.value === 'pending' || (domain.value && !results.value)
    ? undefined
    : (results.value ? results.value.crux?.cwv || results.value.lighthouse.performance : 100)
  const color = !value ? '#6b7280' : value >= 90 ? '#23c55e' : value >= 50 ? '#fbbf24' : '#ef4444'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="${radius * 2}" width="${radius * 2}">
    <style>@keyframes spin {
  from {transform: rotate(0deg)}
  to {transform: rotate(360deg)}
}</style>
    <circle
      stroke="${color}"
      fill="transparent"
      stroke-linecap="round"
      stroke-dasharray="${circumference + ' ' + circumference}"
      style="transform-origin:center;stroke-dashoffset:${circumference - (Math.floor((value || 85) / 4) * 4) / 100 * circumference};transform:rotate(270deg)${!value ? ';animation:spin 1s linear infinite' : ''}"
      stroke-width="${stroke}"
      r="${normalizedRadius}"
      cx="${radius}"
      cy="${radius}"
    />
    <circle
      fill="${color}"
      stroke-width="${stroke}"
      r="${normalizedRadius - 35}"
      cx="${radius}"
      cy="${radius}"
    />
  </svg>`
  return `data:image/svg+xml;base64,${btoa(svg)}`
})

useHead({
  title: () => domain.value ? domain.value : 'page-speed.dev',
  link: [
    () => ({
      key: 'favicon',
      rel: 'icon',
      type: 'image/svg',
      href: favicon.value
    })
  ]
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
        `Core Web Vitals: ${results.value?.crux.cwv} | ` +
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

function navigateToNewDomain () {
  if (!newDomain.value) { return }

  const host = parseURL(newDomain.value).host || newDomain.value
  editing.value = false
  return navigateTo('/' + withoutLeadingSlash(host).toLowerCase().replace(/(\/|\?).*$/, '').trim())
}

const shareLink = computed(() => domain.value ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out the Page Speed results for ${domain.value.replace(/\./g, '.​')}` + `\n\nhttps://page-speed.dev/${domain.value}`)}` : 'See and share PageSpeed Insights results simply and easily.')

async function nativeShare () {
  try {
    if (navigator.share) {
      return await navigator.share({
        title: 'page-speed.dev',
        text: `See page speed results for ${domain.value.replace(/\./g, '.​')}`,
        url: canonicalURL.value,
      })
    }
  } catch {
    // ignore errors sharing to native share and fall back directly to Twitter
  }
  return await navigateTo(shareLink.value, { external: true, open: { target: '_blank' } })
}

</script>
