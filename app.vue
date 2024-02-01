<template>
  <div class="font-sans text-white min-h-screen min-w-screen flex flex-col items-start justify-start bg-[#212121]">
    <div class="flex flex-col justify-start mt-4 sm:mt-8 md:my-12 p-4 gap-8 md:gap-12 flex-grow">
      <h1 class="flex flex-row gap-4 text-white text-3xl md:text-5xl">
        <span class="text-green-400">&raquo;</span>
        <button v-if="domain && !editing" class="bg-transparent" @click="enableEditing">{{ domain }}</button>
        <form v-else class="flex flex-col gap-4" @submit.prevent="navigateToNewDomain">
          <input ref="input" v-model="newDomain" name="domain" type="text"
            class="leading-none tracking-none py-0  bg-transparent outline-none focus:underline underline-dashed"
            autofocus placeholder="Enter a domain" required />
          <button type="submit"
            class="bg-green-400 text-black hover: hover:bg-white focus:bg-white active:bg-white text-xl md:text-2xl py-2 px-6 md:self-start">See
            results</button>
        </form>
      </h1>
      <template v-if="!editing && domain">
        <div v-if="status === 'pending' || results"
          class="flex flex-row flex-wrap gap-4 lg:flex-row justify-around w-full">
          <ProgressRing size="normal" :value="results && status !== 'pending' ? results.performance : undefined"
            caption="performance" />
          <ProgressRing size="normal" :value="results && status !== 'pending' ? results.accessibility : undefined"
            caption="accessibility" />
          <ProgressRing size="normal" :value="results && status !== 'pending' ? results.bestPractices : undefined"
            caption="best practices" />
          <ProgressRing size="normal" :value="results && status !== 'pending' ? results.seo : undefined" caption="SEO" />
        </div>
        <div v-else-if="domain">
          No results could be fetched. Is it a valid domain?
        </div>
        <div class="flex flex-col gap-2 mt-auto md:mt-8">
          <NuxtLink type="submit"
            class="bg-green-400 text-black hover: hover:bg-white focus:bg-white active:bg-white text-xl md:text-2xl py-2 px-6 md:self-start mb-8"
            :href="shareLink" @click.prevent="nativeShare">
            Share results
          </NuxtLink>
          <span v-if="results?.timestamp" class="text-gray-400">
            Last updated at
            <NuxtTime :datetime="results.timestamp" dateStyle="full" />.
          </span>
          <a :href="`https://pagespeed.web.dev/analysis?url=https://${domain}`"
            class="self-start underline text-gray-400 hover:text-green-400 focus:text-green-400 active:text-green-400">
            See full results on PageSpeed Insights &raquo;
          </a>
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
  setTimeout(() => {
    input.value?.focus()
    input.value?.setSelectionRange(0, input.value.value.length)
  }, 10)
}

const { data: results, status, refresh } = await useFetch(() => `/api/run/${domain.value}`, {
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
    : (results.value ? Math.floor((results.value.performance + results.value.accessibility + results.value.bestPractices + results.value.seo) / 4) : 100)
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

useServerSeoMeta({ ogUrl: canonicalURL.value })
useSeoMeta({ title: () => domain.value ? `page-speed.dev - ${domain.value}` : 'page-speed.dev' })

if (!domain.value) {
  defineOgImageComponent('Home')
  useServerSeoMeta({
    description: 'See and share PageSpeed Insights results simply and easily.',
  })
} else if (results.value) {
  useServerSeoMeta({
    description:
      `Performance: ${results.value?.performance} | ` +
      `Accessibility: ${results.value?.accessibility} | ` +
      `Best Practices: ${results.value?.bestPractices} | ` +
      `SEO: ${results.value?.seo}`
  })

  defineOgImageComponent('Lighthouse', {
    performance: results.value?.performance,
    accessibility: results.value?.accessibility,
    bestPractices: results.value?.bestPractices,
    seo: results.value?.seo,
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
