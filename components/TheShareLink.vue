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
  'https://twitter.com/intent/tweet?text=' +
  (props.domain ? encodeURIComponent([text.value, canonicalURL.value].join('\n\n')) : text.value)
)
var copyButtonText = ref("copy link to share")
async function copyShare(link) {
  try {
    await navigator.clipboard.writeText(link);

    copyButtonText.value = "link copied";

    setTimeout(() => {
    copyButtonText.value = "copy link to share";
    }, 5000);
  } catch (error) {
    copyButtonText.value = "link could not be copied";
  }
  
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
    <NuxtLink type="submit"
      class="bg-green-400 text-black hover: hover:bg-white focus:bg-white active:bg-white text-xl md:text-2xl py-2 px-6 md:self-start mb-8"
      :href="shareLink" @click.prevent="nativeShare">
      share results
    </NuxtLink>
      <button type="submit"
      class="bg-green-400 text-black hover: hover:bg-white focus:bg-white active:bg-white text-xl md:text-2xl py-2 px-6 md:self-start mb-8"
       @click.prevent="copyShare(canonicalURL)">
     {{ copyButtonText }}
    </button>
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

