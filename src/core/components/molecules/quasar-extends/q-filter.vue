<template>
  <q-btn
    size="sm"
    rounded
    round
    flat
  >
    <q-icon
      size="22px"
      name="sym_o_tune"
    ></q-icon>
    <q-tooltip>Filter</q-tooltip>
    <q-menu
      v-model="menu"
      class="menus-context"
    >
      <slot />
    </q-menu>
  </q-btn>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

// props & emits
const emits = defineEmits(['update:modelValue', 'close', 'search', 'select'])
const props = withDefaults(
  defineProps<{
    modelValue: boolean
  }>(),
  {}
)

const menu = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})
</script>
