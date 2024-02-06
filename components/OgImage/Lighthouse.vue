<script setup lang="ts">
defineProps({
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
</script>

<template>
  <div class="h-full w-full flex items-start justify-start border-solid bg-[#212121] text-white">
    <div class="flex flex-col items-center justify-between h-full w-full">
      <div class="flex flex-col justify-center gap-8 pt-12 pb-6 w-full">
        <div class="flex flex-row flex-wrap gap-4 lg:flex-row justify-around w-full">
          <template v-if="crux">
              <Histogram v-if="crux.cwv" caption="core vitals" :value="{ caption: '', segments: [100, 100, 100] }">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-green-500" width="12rem" height="12rem" viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="m10 13.6l5.9-5.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-6.6 6.6q-.3.3-.7.3t-.7-.3l-2.6-2.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275z" />
                </svg>
              </Histogram>
              <Histogram v-else
                caption="core vitals" 
                :value="{ caption: '', segments: [100] }">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-red-500" width="12rem" height="12rem"  viewBox="0 0 24 24"><path fill="currentColor" d="M16.066 8.995a.75.75 0 1 0-1.06-1.061L12 10.939L8.995 7.934a.75.75 0 1 0-1.06 1.06L10.938 12l-3.005 3.005a.75.75 0 0 0 1.06 1.06L12 13.06l3.005 3.006a.75.75 0 0 0 1.06-1.06L13.062 12z"/></svg>
              </Histogram>
            <Histogram :value="crux.lcp"
              caption="LCP" />
            <Histogram :value="crux.cls"
              caption="CLS" />
            <Histogram :value="crux.inp"
              caption="INP" />
          </template>
          <template v-else-if="lighthouse">
            <ProgressRing :value="lighthouse.performance" caption="performance" />
            <ProgressRing :value="lighthouse.accessibility" caption="accessibility" />
            <ProgressRing :value="lighthouse.bestPractices" caption="best practices" />
            <ProgressRing :value="lighthouse.seo" caption="SEO" />
          </template>
        </div>
        <div v-if="crux"
          class="flex flex-row flex-wrap gap-4 lg:flex-row justify-around self-center mx-auto w-full border border-green-700 border-2 rounded-lg p-4 text-2xl">
          <span class="flex flex-row gap-2">
            <span class="font-bold">{{ lighthouse.performance }}</span>
            <span>performance</span>
          </span>
          <span class="flex flex-row gap-2">
            <span class="font-bold">{{ lighthouse.accessibility }}</span>
            <span>accessibility</span>
          </span>
          <span class="flex flex-row gap-2">
            <span class="font-bold">{{ lighthouse.bestPractices }}</span>
            <span>best practices</span>
          </span>
          <span class="flex flex-row gap-2">
            <span class="font-bold">{{ lighthouse.seo }}</span>
            <span>SEO</span>
          </span>
        </div>
      </div>
      <div class="flex flex-row gap-4 self-end text-white text-5xl pr-8 pt-4 pb-24">
        <span class="text-green-400">&raquo;</span> {{ domain }}
      </div>
    </div>
  </div>
</template>
