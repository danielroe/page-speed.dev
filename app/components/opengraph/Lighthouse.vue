<script setup lang="ts">
const props = defineProps({
  domain: {
    type: String,
    required: true,
  },
})

const [crux, lighthouse] = await Promise.all([$fetch(`/api/crux/${props.domain}`).catch(() => null), $fetch(`/api/run/${props.domain}`)])

const keys = ['performance', 'accessibility', 'bestPractices', 'seo'] as const
const showConfetti = computed(() => {
  // CWV fail, but ignore if there is now CrUX data
  if (crux && !crux.cwv)
    return false
  return lighthouse && keys.every(key => lighthouse[key] === 100)
})
</script>

<template>
  <div class="h-full w-full flex items-start justify-start border-solid bg-[#212121] text-white px-8">
    <div
      v-if="showConfetti"
      class="bg-confetti h-full w-full top-0 left-10 absolute"
    />
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
            <ProgressRing
              :value="lighthouse.performance"
              caption="performance"
            />
            <ProgressRing
              :value="lighthouse.accessibility"
              caption="accessibility"
            />
            <ProgressRing
              :value="lighthouse.bestPractices"
              caption="best practices"
            />
            <ProgressRing
              :value="lighthouse.seo"
              caption="SEO"
            />
          </template>
        </div>
        <LighthouseTable
          v-if="crux"
          v-bind="lighthouse"
          class="text-2xl"
          row
        />
      </div>
      <div class="flex flex-row gap-4 self-end text-white text-5xl pr-8 pt-4 pb-24">
        <span class="text-green-400">&raquo;</span> {{ domain }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* https://stackoverflow.blog/2021/05/31/shipping-confetti-to-stack-overflows-design-system */
.bg-confetti {
  background-repeat: repeat-x;
  background-position: top -10px center;
  background-image: url("data:image/svg+xml,%3Csvg width='574' height='60' viewBox='0 0 574 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect opacity='0.8' x='27.1224' y='20.0458' width='5' height='13' transform='rotate(-139 27.1224 20.0458)' fill='%23F23B14'/%3E%3Crect opacity='0.8' x='118.478' y='7.00201' width='5' height='13' transform='rotate(-38.8114 118.478 7.00201)' fill='%23FBBA23'/%3E%3Crect opacity='0.8' x='504.616' y='25.4479' width='5' height='13' transform='rotate(-60.2734 504.616 25.4479)' fill='%23F23B14'/%3E%3Crect opacity='0.6' x='538.983' y='45.555' width='5' height='13' transform='rotate(16.7826 538.983 45.555)' fill='%232A2F6A'/%3E%3Crect opacity='0.3' x='470.322' y='2.63625' width='5' height='13' transform='rotate(11.295 470.322 2.63625)' fill='%2333AAFF'/%3E%3Crect opacity='0.3' x='190.295' y='4.58138' width='5' height='13' transform='rotate(27.5954 190.295 4.58138)' fill='%23F23B14'/%3E%3Crect opacity='0.8' x='234.303' y='16.3233' width='5' height='13' transform='rotate(-41.8233 234.303 16.3233)' fill='%2365BB5C'/%3E%3Crect opacity='0.6' x='369.702' y='40.9875' width='5' height='13' transform='rotate(-56.419 369.702 40.9875)' fill='%2333AAFF'/%3E%3Crect opacity='0.3' x='402.121' y='31.0848' width='5' height='13' transform='rotate(-17.9234 402.121 31.0848)' fill='%23F23B14'/%3E%3Crect opacity='0.6' x='200.316' y='31.9328' width='5' height='13' transform='rotate(-15.8896 200.316 31.9328)' fill='%232A2F6A'/%3E%3Crect opacity='0.6' x='69.6745' y='23.4725' width='6' height='10' transform='rotate(70.0266 69.6745 23.4725)' fill='%2365BB5C'/%3E%3Crect opacity='0.6' x='291.945' y='7.16931' width='6' height='10' transform='rotate(30.4258 291.945 7.16931)' fill='%23FBBA23'/%3E%3Crect opacity='0.3' x='33.7754' y='38.2208' width='6' height='10' transform='rotate(38.6056 33.7754 38.2208)' fill='%23FBBA23'/%3E%3Crect opacity='0.8' x='109.752' y='31.1743' width='6' height='10' transform='rotate(28.5296 109.752 31.1743)' fill='%2333AAFF'/%3E%3Crect opacity='0.3' x='278.081' y='37.8695' width='6' height='10' transform='rotate(-26.5651 278.081 37.8695)' fill='%23F23B14'/%3E%3Crect opacity='0.8' x='416.294' y='11.5573' width='6' height='10' transform='rotate(-22.8498 416.294 11.5573)' fill='%23FBBA23'/%3E%3Crect opacity='0.3' x='354.667' y='9.32341' width='6' height='10' transform='rotate(17.7506 354.667 9.32341)' fill='%232A2F6A'/%3E%3Crect opacity='0.8' x='532.404' y='16.6372' width='6' height='10' transform='rotate(-75.3432 532.404 16.6372)' fill='%23FBBA23'/%3E%3Crect opacity='0.6' x='460.463' y='39.3557' width='6' height='10' transform='rotate(45.4982 460.463 39.3557)' fill='%2365BB5C'/%3E%3C/svg%3E");
}
</style>
