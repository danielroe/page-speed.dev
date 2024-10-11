<script setup lang="ts">
const props = defineProps({
  value: {
    type: [Boolean, Number] as unknown as () => number | false | undefined,
  },
  caption: {
    type: String,
    required: true,
  },
  size: {
    type: String as () => 'large' | 'normal',
    default: 'large',
  },
})

const radius = props.size === 'large' ? 132 : 75
const stroke = props.size === 'large' ? 14 : 9
const normalizedRadius = radius - stroke * 2
const circumference = normalizedRadius * 2 * Math.PI

const colorMap = {
  green: 'text-green-500',
  red: 'text-red-500',
  yellow: 'text-yellow-500',
  gray: 'text-gray-500',
}

const color = computed(() => {
  if (!props.value)
    return colorMap.gray
  if (props.value >= 90)
    return colorMap.green
  if (props.value >= 50)
    return colorMap.yellow
  return colorMap.red
})
</script>

<template>
  <span
    class="flex flex-col items-center"
    :class="size === 'large' ? 'gap-10' : 'gap-4'"
  >
    <span
      class="relative rounded-full flex items-center justify-center overflow-hidden"
      :class="[size === 'large' ? 'text-7xl h-60 w-60' : 'text-3xl h-36 w-36', color]"
    >
      <svg
        class="absolute -right-0 -bottom-0"
        :height="radius * 2"
        :width="radius * 2"
        :class="{ 'animate-spin': !value }"
      >
        <circle
          stroke="currentColor"
          fill="transparent"
          class="transform-origin-center"
          stroke-linecap="round"
          :stroke-dasharray="`${circumference} ${circumference}`"
          :style="{
            strokeDashoffset: circumference - (Math.floor((typeof value === 'number' ? value : 80) / 4) * 4) / 100 * circumference,
            transform: 'rotate(270deg)',
          }"
          :stroke-width="stroke"
          :r="normalizedRadius"
          :cx="radius"
          :cy="radius"
        />
      </svg>
      {{ typeof value === 'number' ? value.toFixed(0) : '' }}
    </span>
    <span :class="size === 'large' ? 'text-4xl' : 'text-2xl'">{{ caption }}</span>
  </span>
</template>
