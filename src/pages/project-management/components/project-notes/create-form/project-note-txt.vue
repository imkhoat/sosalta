<template>
  <q-input
    class="project-note-txt"
    id="txt"
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
