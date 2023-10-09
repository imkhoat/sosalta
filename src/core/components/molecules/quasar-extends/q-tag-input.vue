<template>
  <q-field
    id="project-tags"
    label="Tags"
    stack-label
    outlined
    dense
  >
    <div class="column justify-start items-stretch q-pa-sm">
      <div class="row justify-start items-center q-gutter-x-xs q-mb-md">
        <q-chip
          v-for="(tag, index) in projectProperties"
          :key="index"
          removable
          dense
          square
          @remove="onRemoveProperties(tag)"
          :tabindex="index"
          icon-remove="delete"
          class="text-caption q-ma-none q-mr-xs q-mt-xs"
          >{{ `${tag.key}<>${tag.value}` }}</q-chip
        >
      </div>
      <div class="row justify-between items-center q-gutter-x-xs no-wrap">
        <q-input
          id="key-name"
          placeholder="Key..."
          stack-label
          outlined
          dense
          lazy-rules
          class="bg-grey-2"
          hide-bottom-space
          v-bind="$attrs"
          v-model="property.key"
        ></q-input>
        <q-input
          id="value-name"
          placeholder="Value..."
          stack-label
          outlined
          dense
          lazy-rules
          class="bg-grey-2"
          hide-bottom-space
          v-bind="$attrs"
          v-model="property.value"
        ></q-input>
        <q-btn
          size="md"
          :disable="disable"
          unelevated
          flat
          color="primary"
          icon="sym_o_add"
          class="bg-grey-1"
          @click="onCreateNewProperty"
        ></q-btn>
      </div>
    </div>
  </q-field>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'

// props & emits
const props = defineProps<{
  modelValue: { key: string; value: string }[]
  disable: boolean
  textValue?: string
  textLabel?: string
}>()
const emits = defineEmits(['update:modelValue'])
// data
const projectProperties = ref<{ key: string; value: string }[]>([
  ...props.modelValue,
])
const property = reactive({
  key: '',
  value: '',
})

// method
function onRemoveProperties(tag: { key: string; value: string }) {
  projectProperties.value = projectProperties?.value?.filter(
    (item) => item.key === tag.key
  )
  emits('update:modelValue', projectProperties.value)
}

function onCreateNewProperty() {
  projectProperties?.value?.push({
    key: property.key,
    value: property.value,
  })
  emits('update:modelValue', projectProperties.value)
}
</script>
