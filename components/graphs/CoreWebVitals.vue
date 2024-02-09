<script setup lang="ts">
defineProps({
  loading: Boolean,
  pass: Boolean,
  lcp: Object as () => {
    caption: string | number
    segments: number[]
  },
  cls: Object as () => {
    caption: string | number
    segments: number[]
  },
  inp: Object as () => {
    caption: string | number
    segments: number[]
  },
  size: {
    type: String as () => 'large' | 'normal',
    default: 'large'
  },
  showP75: {
    type: Boolean,
    default: false
  }
})

const descriptions = {
  lcp: {
    title: 'Largest Contentful Paint',
    abbreviation: 'LCP',
    description: 'measures loading performance. To provide a good user experience, LCP must occur within 2.5 seconds of when the page first starts loading.',
    // link: 'https://web.dev/articles/lcp'
  },
  cls: {
    title: 'Cumulative Layout Shift',
    abbreviation: 'CLS',
    description: 'measures visual stability. To provide a good user experience, must should maintain a CLS of 0.1. or less.',
    // link: 'https://web.dev/articles/cls'
  },
  inp: {
    title: 'Input Delay',
    abbreviation: 'INP',
    description: 'measures overall responsiveness to user interactions. To provide a good user experience, must be below or at 200 milliseconds.',
    // link: 'https://web.dev/articles/inp'
  },
}
</script>

<template>
  <Histogram v-if="loading" :size="size" caption="core vitals" />
  <Histogram v-else-if="pass" :size="size" caption="core vitals" :value="{ segments: [100, 0, 0] }">
    <svg xmlns="http://www.w3.org/2000/svg" class="text-green-500" :width="size == 'normal' ? '6rem' : '12rem'"
      :height="size == 'normal' ? '6rem' : '12rem'" viewBox="0 0 24 24">
      <path fill="currentColor"
        d="m10 13.6l5.9-5.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-6.6 6.6q-.3.3-.7.3t-.7-.3l-2.6-2.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275z" />
    </svg>
  </Histogram>
  <Histogram v-else :size="size" caption="core vitals" :value="{ segments: [0, 0, 100] }">
    <svg xmlns="http://www.w3.org/2000/svg" class="text-red-500" :width="size == 'normal' ? '6rem' : '12rem'"
      :height="size == 'normal' ? '6rem' : '12rem'" viewBox="0 0 24 24">
      <path fill="currentColor"
        d="M16.066 8.995a.75.75 0 1 0-1.06-1.061L12 10.939L8.995 7.934a.75.75 0 1 0-1.06 1.06L10.938 12l-3.005 3.005a.75.75 0 0 0 1.06 1.06L12 13.06l3.005 3.006a.75.75 0 0 0 1.06-1.06L13.062 12z" />
    </svg>
  </Histogram>
  <Histogram v-for="metric, key in { lcp, cls, inp }" :size="size" :show-p75="showP75"
    :value="loading ? undefined : metric">
    <template #caption>
      <div
        class="group cursor-pointer border-b-1 border-b-dashed hover:border-green-400 hover:text-green-400 focus:text-green-400"
        tabindex="0" :aria-describedby="`tooltip-${key}`">
        {{ descriptions[key].abbreviation }}
        <div :id="`tooltip-${key}`" aria-role="tooltip"
          class="hidden group-hover:block group-focus:block absolute z-1 left-[10vw] p-6 text-gray-400 -mt-2">
          <div class="p-4 border-green-500 border w-[80vw] max-w-[500px]  rounded-lg bg-[#212121]">
            <strong class="text-white">{{ descriptions[key].title }}</strong>
            {{ descriptions[key].description }}
            <!-- <NuxtLink :href="descriptions[key].link" target="_blank" class="text-white hover:text-green-500 focus:text-green-500 underline">Learn more &raquo;</NuxtLink> -->
          </div>
        </div>
      </div>
    </template>
</Histogram></template>
