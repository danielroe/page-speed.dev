<template>
  <div>
    <NuxtWelcome />
  </div>
</template>

<script lang="ts" setup>
defineOgImageComponent('Lighthouse', {
  domain: 'page-speed.dev',
  performance: 99,
  accessibility: 80,
  bestPractices: 95,
  seo: 100,
})
</script>
