<script setup lang="ts">
const props = defineProps({
  value: {
    type: Object as () => {
      caption?: string | number
      segments: number[]
    } | null,
    default: null,
  },
  caption: {
    type: String,
    default: '',
  },
  size: {
    type: String as () => 'large' | 'normal',
    default: 'large',
  },
  showP75: {
    type: Boolean,
    default: false,
  },
})

const radius = props.size === 'large' ? 132 : 75
const stroke = props.size === 'large' ? 14 : 9
const normalizedRadius = radius - stroke * 2
const circumference = normalizedRadius * 2 * Math.PI

const colours = [
  '#ef4444',
  '#fbbf24',
  '#23c55e',
  '#6b7280',
]

const p75Color = computed(() => {
  let count = 0
  for (const [index, segment] of props.value?.segments?.entries() || []) {
    count += segment
    if (count >= 75)
      return colours[colours.length - index - 2]
  }
  return '#6b7280'
})
</script>

<template>
  <div
    class="flex flex-col items-center"
    :class="size === 'large' ? 'gap-10' : 'gap-4'"
  >
    <span
      class="relative rounded-full flex items-center justify-center"
      :class="[size === 'large' ? 'text-7xl h-60 w-60' : 'text-3xl h-36 w-36']"
    >
      <svg
        class="absolute -right-0 -bottom-0"
        :height="radius * 2"
        :width="radius * 2"
        :class="{ 'animate-spin': !value }"
      >
        <circle
          v-for="segment, index of value?.segments.length === 0 ? [0, 0, 0, 100] : [...value?.segments || [80]].reverse()"
          :key="index"
          :stroke="value ? colours[index] : '#6b7280'"
          fill="transparent"
          class="transform-origin-center"
          :stroke-dasharray="`${circumference} ${circumference}`"
          :style="{
            strokeDashoffset: circumference - segment / 100 * circumference,
            transform: `rotate(270deg)`,
          }"
          :stroke-width="stroke"
          :r="normalizedRadius"
          :cx="radius"
          :cy="radius"
        />
        <circle
          v-if="value && value.segments.length > 0 && showP75"
          :fill="p75Color"
          stroke="#fff"
          stroke-width="5"
          cx="20"
          cy="20"
          r="10"
          style="transform: translateX(-2px) translateY(calc(50% - 20px))"
        />
      </svg>
      <slot>
        <span
          v-if="value?.caption"
          class="flex flex-row items-baseline gap-1"
        >
          <span :class="size === 'large' ? 'text-6xl' : 'text-3xl'">{{ value.caption.toString().replace(/m?s/, '') }}</span>
          <span
            v-if="value.caption.toString().match(/m?s/)"
            :class="size === 'large' ? 'text-4xl' : 'text-lg'"
          >{{ value.caption.toString().match(/m?s/)![0] }}</span>
        </span>
      </slot>
    </span>
    <slot name="caption">
      <span :class="size === 'large' ? 'text-4xl' : 'text-2xl'">{{ caption }}</span>
    </slot>
  </div>
</template>
