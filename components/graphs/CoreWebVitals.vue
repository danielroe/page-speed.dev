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
</script>

<template>
  <Histogram v-if="loading" :size="size" caption="core vitals" />
  <Histogram v-else-if="pass" :size="size" caption="core vitals" :value="{ segments: [100, 0, 0] }">
    <svg xmlns="http://www.w3.org/2000/svg" class="text-green-500" :width="size == 'normal' ? '6rem' : '12rem'" :height="size == 'normal' ? '6rem' : '12rem'" viewBox="0 0 24 24">
      <path fill="currentColor" d="m10 13.6l5.9-5.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-6.6 6.6q-.3.3-.7.3t-.7-.3l-2.6-2.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275z" />
    </svg>
  </Histogram>
  <Histogram v-else :size="size" caption="core vitals" :value="{ segments: [0, 0, 100] }">
    <svg xmlns="http://www.w3.org/2000/svg" class="text-red-500" :width="size == 'normal' ? '6rem' : '12rem'" :height="size == 'normal' ? '6rem' : '12rem'" viewBox="0 0 24 24">
      <path fill="currentColor" d="M16.066 8.995a.75.75 0 1 0-1.06-1.061L12 10.939L8.995 7.934a.75.75 0 1 0-1.06 1.06L10.938 12l-3.005 3.005a.75.75 0 0 0 1.06 1.06L12 13.06l3.005 3.006a.75.75 0 0 0 1.06-1.06L13.062 12z"/>
    </svg>
  </Histogram>
  <Histogram :size="size" :show-p75="showP75" :value="loading ? undefined : lcp" caption="LCP" />
  <Histogram :size="size" :show-p75="showP75" :value="loading ? undefined : cls" caption="CLS" />
  <Histogram :size="size" :show-p75="showP75" :value="loading ? undefined : inp" caption="INP" />
</template>

