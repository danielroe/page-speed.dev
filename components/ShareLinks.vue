<script setup lang="ts">
import { joinURL } from 'ufo'

const props = defineProps({
  domain: String,
  timestamp: Number,
  type: String as () => 'crux' | 'pagespeed-insights',
})

const resultType = computed(() => props.type === 'crux' ? 'Core Web Vitals' : 'PageSpeed Insights')
const text = computed(() => props.domain
  ? `👉 Check out the ${resultType.value} performance of ${props.domain.replace(/\./g, '.​')}.`
  : `Check out page-speed.dev - a quick, cached way to see and share web performance results.`
)

const canonicalURL = computed(() => props.domain ? joinURL(`https://page-speed.dev`, props.domain) : 'https://page-speed.dev')
const shareLink = computed(() =>
  (props.domain ? encodeURIComponent([text.value, canonicalURL.value].join('\n\n')) : text.value)
)

async function nativeShare () {
  if (!props.domain) { return }
  try {
    if (navigator.share) {
      return await navigator.share({
        title: props.domain ? `page-speed.dev - ${props.domain}` : 'page-speed.dev',
        text: text.value,
        url: canonicalURL.value,
      })
    }
  } catch {
    // ignore errors sharing to native share and fall back directly to Twitter
  }
  return await navigateTo(shareLink.value, { external: true, open: { target: '_blank' } })
}
</script>

<template>
  <div class="flex flex-col gap-2 mt-auto md:mt-8">
    <div class="self-start text-gray-400">Share results</div>
    <div class="flex flex-row gap-2 mb-7">
      <SocialShare
        v-for="network in ['twitter', 'whatsapp', 'telegram', 'reddit', 'pocket', 'email']"
        :key="network"
        :network="network"
        :styled="true"
        :label="false"
        class="p-3 rounded-full opacity-70 hover:opacity-100"
        :url="shareLink"
      />
    </div>
    <a v-if="type === 'crux'"
      :href="`https://lookerstudio.google.com/c/u/0/reporting/bbc5698d-57bb-4969-9e07-68810b9fa348/page/keDQB?params=%7B%22origin%22:%22https://${domain}%22%7D`"
      class="self-start underline text-gray-400 hover:text-green-400 focus:text-green-400 active:text-green-400">
      explore full results in the CrUX Dashboard &raquo;
    </a>
    <a v-else :href="`https://pagespeed.web.dev/analysis?url=https://${domain}`"
      class="self-start underline text-gray-400 hover:text-green-400 focus:text-green-400 active:text-green-400">
      see full results on PageSpeed Insights &raquo;
    </a>
    <span v-if="timestamp" class="text-gray-400">
      last updated at
      <NuxtTime :datetime="timestamp" dateStyle="full" timeStyle="medium" />.
    </span>
  </div>
</template>

