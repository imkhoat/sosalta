<template>
  <q-input
    class="q-txt-input"
    id="txt"
    placeholder="Please type your text content here"
    stack-label
    outlined
    v-bind="$attrs"
    v-model="text"
    :hint="totalCharacter"
    type="textarea"
  />
</template>
<script lang="ts" setup>
import { computed } from 'vue'

// props
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])

// computed
const text = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

const totalCharacter = computed(() => {
  return `${text.value?.toString()?.length} characters`
})
</script>
