<template>
  <div class="font-sans text-white min-h-screen min-w-screen flex flex-col items-start justify-start bg-[#212121]">
    <div class="flex flex-col justify-start md:my-12 p-4 gap-8 md:gap-12">
      <h1 class="flex flex-row gap-4 text-white text-3xl md:text-5xl">
        <span class="text-green-400">&raquo;</span>
        <span v-if="domain && !editing" @click="enableEditing">{{ domain }}</span>
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
        <div v-if="status === 'pending' || results" class="flex flex-row flex-wrap gap-4 lg:flex-row justify-around w-full">
          <ProgressRing size="normal" :value="status === 'pending' ? undefined : results!.performance" caption="performance" />
          <ProgressRing size="normal" :value="status === 'pending' ? undefined : results!.accessibility" caption="accessibility" />
          <ProgressRing size="normal" :value="status === 'pending' ? undefined : results!.bestPractices" caption="best practices" />
          <ProgressRing size="normal" :value="status === 'pending' ? undefined : results!.seo" caption="SEO" />
        </div>
        <div v-else-if="domain">
          No results could be fetched. Is it a valid domain?
        </div>
        <div class="flex flex-col gap-2">
          <span v-if="results?.timestamp" class="text-gray-500">
            Last updated at
            <NuxtTime :datetime="results.timestamp" date-style="full" />.
          </span>
          <a :href="`https://pagespeed.web.dev/analysis?url=https://${domain}`"
          class="underline text-gray-500 hover:text-green-400 focus:text-green-400 active:text-green-400">See full results
          on PageSpeed Insights &raquo;</a>
        </div>
        <NuxtLink type="submit"
          class="bg-green-400 text-black hover: hover:bg-white focus:bg-white active:bg-white text-xl md:text-2xl py-2 px-6 md:self-start"
          :href="shareLink" @click.prevent="nativeShare">Share results</NuxtLink>
      </template>
    </div>
    <footer class="mt-auto p-3 text-gray-500">
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
import { withoutLeadingSlash, parseURL } from 'ufo'

const route = useRoute()
const domain = computed(() => withoutLeadingSlash(route.path).replace(/\/.*$/, '').trim())
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

if (import.meta.server && domain.value && results.value) {
  useServerSeoMeta({
    title: 'page-speed.dev - ' + domain.value,
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
  return navigateTo('/' + host)
}

const shareLink = computed(() => `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out the Page Speed results for ${domain.value.replace(/\./g, '.\x00')}` + `\n\nhttps://page-speed.dev/${domain.value}`)}`)

async function nativeShare () {
  try {
    if (navigator.share) {
      return await navigator.share({
        title: 'page-speed.dev',
        text: `See page speed results for ${domain.value}`,
        url: `https://page-speed.dev/${domain.value}`,
      })
    }
  } catch {
    // ignore errors sharing to native share and fall back directly to Twitter
  }
  return await navigateTo(shareLink.value, { external: true, open: { target: '_blank' } })
}

</script>
