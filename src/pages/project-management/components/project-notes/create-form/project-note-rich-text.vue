<template>
  <q-html-input
    class="project-note-rich-text"
    :markdown="false"
    stack-label
    outlined
    v-model="text"
  ></q-html-input>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

// props
const props = defineProps<{
  modelValue: { value: string }[]
}>()
const emits = defineEmits(['update:modelValue'])

// computed
const text = computed({
  get() {
    return noteContent.value
  },
  set(value) {
    emits('update:modelValue', [{ value }])
  },
})

const noteContent = computed(() => {
  return props.modelValue[0]?.value ?? ''
})
const totalCharacter = computed(() => {
  return `${text.value?.toString()?.length} characters`
})
</script>
