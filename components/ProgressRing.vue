<script setup lang="ts">
const radius = 132
const stroke = 14
const normalizedRadius = radius - stroke * 2
const circumference = normalizedRadius * 2 * Math.PI

defineProps({
  value: {
    type: Number,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  }
})
</script>

<template>
  <span class="flex flex-col items-center gap-10">
    <span class="text-7xl text-green-500 border-14 rounded-full h-60 w-60 flex items-center justify-center">
      <svg class="absolute -right-3 -bottom-3" :height="radius * 2" :width="radius * 2">
        <circle
          stroke="currentColor"
          fill="transparent"
          stroke-linecap="round"
          :stroke-dasharray="circumference + ' ' + circumference"
          :style="{ strokeDashoffset: circumference - value / 100 * circumference }"
          :stroke-width="stroke"
          :r="normalizedRadius"
          :cx="radius"
          :cy="radius"
        />
      </svg>
      {{ value }}
    </span>
    <span class="text-4xl">{{ caption }}</span>
  </span>
</template>

