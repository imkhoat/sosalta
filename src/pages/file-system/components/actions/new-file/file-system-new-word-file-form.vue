<template>
  <div class="column full-height justify-start items-stretch q-gutter-y-md">
    <q-input
      id="file-name"
      label="File name"
      stack-label
      outlined
      dense
      :readonly="edit"
      v-bind="$attrs"
      v-model="fileName"
    >
      <template
        v-if="!edit"
        v-slot:append
      >
        <span class="text-caption text-disable">.docx</span>
      </template>
    </q-input>
    <q-html-input
      :docx="true"
      stack-label
      outlined
      class="col-grow"
      v-model="fileString"
    ></q-html-input>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

// props
const props = defineProps(['modelValue', 'modelString', 'edit'])
const emits = defineEmits(['update:modelValue', 'update:modelString'])

// computed
const fileName = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})
const fileString = computed({
  get() {
    return props.modelString
  },
  set(value) {
    emits('update:modelString', value)
  },
})
</script>
