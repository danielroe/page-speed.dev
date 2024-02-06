<script setup lang="ts">

const props = defineProps({
  value: {
    type: Object as () => {
      caption: string
      segments: number[]
    },
  },
  caption: {
    type: String,
  },
  size: {
    type: String as () => 'large' | 'normal',
    default: 'large'
  }
})

const radius = props.size === 'large' ? 132 : 75
const stroke = props.size === 'large' ? 14 : 9
const normalizedRadius = radius - stroke * 2
const circumference = normalizedRadius * 2 * Math.PI

const colorMap = [
  '#ef4444',
  '#fbbf24',
  '#23c55e'
]

</script>

<template>
  <span class="flex flex-col items-center" :class="size === 'large' ? 'gap-10' : 'gap-4'">
    <span class="relative rounded-full flex items-center justify-center" :class="[size === 'large' ? 'text-7xl h-60 w-60' : 'text-3xl h-36 w-36']">
      <svg class="absolute -right-0 -bottom-0" :height="radius * 2" :width="radius * 2" :class="{ 'animate-spin': !value }">
        <circle
          v-for="segment, index of [...value?.segments || [80]].reverse()"
          :stroke="value ? colorMap[index] : '#6b7280'"
          fill="transparent"
          class="transform-origin-center"
          :stroke-dasharray="circumference + ' ' + circumference"
          :style="{
            strokeDashoffset: circumference - segment / 100 * circumference,
            transform: `rotate(270deg)`,
          }"
          :stroke-width="stroke"
          :r="normalizedRadius"
          :cx="radius"
          :cy="radius"
        />
      </svg>
      <slot>
        <span class="flex flex-row items-baseline gap-1">
          <span :class="size === 'large' ? 'text-6xl' : 'text-3xl'">{{ value?.caption.replace(/m?s/, '') }}</span>
          <span v-if="value?.caption?.match(/m?s/)" :class="size === 'large' ? 'text-4xl' : 'text-lg'">{{ value?.caption?.match(/m?s/)![0] }}</span>
        </span>
      </slot>
    </span>
    <span :class="size === 'large' ? 'text-4xl' : 'text-2xl'">{{ caption }}</span>
  </span>
</template>

