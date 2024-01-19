<script setup lang="ts">
defineProps({
  domain: {
    type: String,
    required: true,
  },
  performance: {
    type: Number,
    required: true,
  },
  accessibility: {
    type: Number,
    required: true,
  },
  bestPractices: {
    type: Number,
    required: true,
  },
  seo: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="h-full w-full flex items-start justify-start border-solid bg-[#212121] text-white">
    <div class="flex flex-col items-center justify-between h-full w-full">
      <div class="flex flex-row justify-center gap-12 pt-12 w-full">
        <ProgressRing :value="performance" caption="performance" />
        <ProgressRing :value="accessibility" caption="accessibility" />
        <ProgressRing :value="bestPractices" caption="best practices" />
        <ProgressRing :value="seo" caption="SEO" />
      </div>
      <div class="flex flex-row gap-4 self-start text-white text-5xl pl-16 pb-24">
        <span class="text-green-400">&raquo;</span> {{ domain }}
      </div>
    </div>
  </div>
</template>
