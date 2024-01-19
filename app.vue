<template>
  <div class="font-sans text-white min-h-screen min-w-screen flex flex-col items-start justify-start bg-[#212121]">
    <div class="flex flex-col justify-start md:my-12 p-4 gap-8 md:gap-12">
      <h1 class="flex flex-row gap-4 text-white text-3xl md:text-5xl">
        <span class="text-green-400">&raquo;</span> {{ domain }}
      </h1>
      <div v-if="results" class="flex flex-row flex-wrap gap-4 lg:flex-row justify-around w-full">
        <ProgressRing size="normal" class="" :value="results.performance" caption="performance" />
        <ProgressRing size="normal" class="" :value="results.accessibility" caption="accessibility" />
        <ProgressRing size="normal" class="" :value="results.bestPractices" caption="best practices" />
        <ProgressRing size="normal" class="" :value="results.seo" caption="SEO" />
      </div>
      <div v-else>
        No results could be fetched. Is it a valid domain?
      </div>
      <a :href="`https://pagespeed.web.dev/analysis?url=https://${domain}`" class="underline text-gray-500 hover:text-green-400 focus:text-green-400 active:text-green-400">See full results on PageSpeed Insights &raquo;</a>
    </div>
    <footer class="mt-auto p-3 text-gray-500">
      <a
        class="underline hover:text-green-400 focus:text-green-400 active:text-green-400"
        href="https://github.com/danielroe/page-speed.dev"
      >source</a>
      &middot;
      made with ❤️ by <a
        class="underline hover:text-green-400 focus:text-green-400 active:text-green-400"
        href="https://x.com/danielcroe"
      >
        @danielcroe
      </a>
    </footer>
  </div>
</template>

<script lang="ts" setup>
const domain = useRoute().path.slice(1)
if (!domain || domain.includes('/')) {
  throw new Error('Invalid domain')
}

const { data: results } = await useFetch(`/api/run/${domain}`)

defineOgImageComponent('Lighthouse', {
  performance: results.value?.performance,
  accessibility: results.value?.accessibility,
  bestPractices: results.value?.bestPractices,
  seo: results.value?.seo,
  domain,
})
</script>

<style>
@import '@unocss/reset/tailwind-compat.css';
</style>
