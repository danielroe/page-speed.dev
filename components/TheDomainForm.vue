<script setup lang="ts">
import { withoutLeadingSlash, parseURL } from 'ufo'

const domain = defineModel('domain', { type: String, default: '' })
const editing = defineModel('editing', { type: Boolean })

const newDomain = ref('')
const input = ref<HTMLInputElement>()

function enableEditing () {
  newDomain.value = domain.value
  editing.value = true
  watch(input, (input) => {
    if (input) {
      input.focus()
      input.setSelectionRange(0, newDomain.value.length)
    }
  }, { once: true })
}

function navigateToNewDomain () {
  if (!newDomain.value) { return }

  const host = parseURL(newDomain.value).host || newDomain.value
  editing.value = false
  return navigateTo('/' + withoutLeadingSlash(host).toLowerCase().replace(/(\/|\?).*$/, '').trim())
}
</script>

<template>
  <button v-if="domain && !editing" class="bg-transparent" @click="enableEditing">{{ domain }}</button>
  <form v-else class="flex flex-col gap-4 overflow-hidden" @submit.prevent="navigateToNewDomain">
    <input ref="input" v-model="newDomain" name="domain" type="text"
      class="md:-mt-1 rounded-none py-0 bg-transparent outline-none border-b-2 border-b-solid border-transparent focus:border-green-500 underline-dashed"
      autofocus inputmode="url" autocapitalize="none" placeholder="enter a domain" required />
    <button type="submit"
      class="bg-green-400 text-black hover: hover:bg-white focus:bg-white active:bg-white text-xl md:text-2xl py-2 px-6 md:self-start">See
      results</button>
  </form>
</template>

