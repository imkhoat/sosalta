<template>
  <div
    class="row justify-between items-center project-management-filter q-gutter-y-md q-gutter-sm-x-md"
  >
    <q-btn-toggle
      v-model="filter"
      unelevated
      size="md"
      toggle-color="brand-05"
      toggle-text-color="brand"
      :options="firstOptions"
      class="text-normal col-grow col-md-auto project-management-filter__filter"
    >
      <q-btn-dropdown
        v-if="dropdownOptions?.length > 0"
        dropdown-icon="sym_o_more_vert"
        no-icon-animation
        rounded
        class="project-management-filter__dropdown"
      >
        <q-list>
          <q-item
            clickable
            v-for="(user, index) in dropdownOptions"
            :key="index + '__project-management-filter'"
          >
            {{ user.label }}
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-btn-toggle>
    <q-input
      dense
      filled
      v-model="search"
      placeholder="Search..."
      class="rounded-borders bg-grey-1 col-12 col-md-6"
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
  items?: string[]
}>()

// computed
const search = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})
const filter = computed({
  get() {
    return props.modelFilter
  },
  set(value) {
    emits('update:modelFilter', value)
    emits('select', value)
  },
})

const filterOptions = computed(() => {
  return (
    props.items?.map((item) => {
      return { label: item, value: item }
    }) ?? []
  )
})

const firstOptions = computed(() => {
  return [{ label: 'All', value: '' }, ...filterOptions.value?.slice(0, 3)]
})

const dropdownOptions = computed(() => {
  return filterOptions.value?.slice(2)
})

// methods
function onStartSearch() {
  emits('search', search.value)
}
</script>

<style lang="scss">
.project-management-filter {
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
