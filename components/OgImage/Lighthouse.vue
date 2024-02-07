<script setup lang="ts">
const props = defineProps({
  domain: {
    type: String,
    required: true,
  },
  lighthouse: {
    type: Object,
    required: true
  },
  crux: {
    type: Object
  },
})

const { data: crux } = await useFetch(() => `/api/crux/${props.domain}`)
const { data: lighthouse } = await useFetch(() => `/api/run/${props.domain}`)
</script>

<template>
  <div class="h-full w-full flex items-start justify-start border-solid bg-[#212121] text-white px-8">
    <div class="flex flex-col items-center justify-between h-full w-full">
      <div class="flex flex-col justify-center gap-8 pt-12 pb-6 w-full">
        <div class="flex flex-row flex-wrap gap-4 lg:flex-row justify-around w-full">
          <template v-if="crux">
            <CoreWebVitals
              :pass="crux.cwv"
              :lcp="crux.lcp"
              :cls="crux.cls"
              :inp="crux.inp"
            />
          </template>
          <template v-else-if="lighthouse">
            <ProgressRing :value="lighthouse.performance" caption="performance" />
            <ProgressRing :value="lighthouse.accessibility" caption="accessibility" />
            <ProgressRing :value="lighthouse.bestPractices" caption="best practices" />
            <ProgressRing :value="lighthouse.seo" caption="SEO" />
          </template>
        </div>
        <LighthouseTable v-if="crux" v-bind="lighthouse" class="text-2xl" row />
      </div>
      <div class="flex flex-row gap-4 self-end text-white text-5xl pr-8 pt-4 pb-24">
        <span class="text-green-400">&raquo;</span> {{ domain }}
      </div>
    </div>
  </div>
</template>
