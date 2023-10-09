<template>
  <div
    class="row justify-between items-center file-system-filter q-gutter-y-md q-gutter-sm-x-md"
  >
    <q-btn-toggle
      v-if="!hiddenFilter"
      v-model="filter"
      unelevated
      size="md"
      toggle-color="brand-05"
      toggle-text-color="brand"
      :options="[
        { label: 'View all', value: 'one' },
        { label: 'Your files', value: 'two' },
        { label: 'Share files', value: 'three' },
      ]"
      class="text-normal col-grow col-md-auto file-system-filter__filter"
    />
    <q-space class="gt-sm"></q-space>
    <q-input
      v-if="!hiddenSearch"
      dense
      filled
      v-model="search"
      placeholder="Search..."
      class="rounded-borders bg-grey-1 col-grow col-md-auto content-end"
      @keypress.enter="onStartSearch"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

// props & emits
const emits = defineEmits([
  'update:modelFilter',
  'update:modelValue',
  'close',
  'search',
  'select',
])
const props = defineProps<{
  modelFilter?: string
  modelValue?: string
  hiddenFilter?: boolean
  hiddenSearch?: boolean
}>()

// computed
const filter = computed({
  get() {
    return props.modelFilter
  },
  set(value) {
    emits('update:modelFilter', value)
  },
})

const search = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

// methods
function onStartSearch() {
  emits('search', search.value)
}
</script>

<style lang="scss">
.file-system-filter {
  .q-btn--outline:before {
    border: 1px solid $grey-5;
  }

  &__filter {
    border: 1px solid $grey-5;
  }

  &__filter .q-btn {
    flex-grow: 1;
  }
}
</style>
