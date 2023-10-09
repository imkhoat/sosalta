<template>
  <div class="row justify-end items-center project-notepages-filter">
    <q-input
      dense
      borderless
      v-model="search"
      placeholder="Search..."
      class="rounded-borders bg-white q-border-none"
      :class="{ 'col-12': fullWidth, 'col-12 col-md-6': !fullWidth }"
      @keypress.enter="onSearch"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-select
          class="project-notepages-filter__search-type"
          borderless
          v-model="searchType"
          :options="searchOptions"
          :option-value="(item) => item"
          hide-hint
          hide-bottom-space
        />
      </template>
    </q-input>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { USER_ROLE } from 'src/core/types/user-role-types'

// props & emits
const emits = defineEmits([
  'update:modelFilter',
  'update:modelValue',
  'update:modelSearchType',
  'close',
  'search',
  'select',
])
const props = defineProps<{
  modelFilter?: string
  modelValue?: string
  modelSearchType?: { label: string; value: string }
  fullWidth?: boolean
}>()

// computed
const filter = computed({
  get() {
    return props.modelFilter
  },
  set(value) {
    emits('update:modelFilter', value)
    emits('search')
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

const searchType = computed({
  get() {
    return props.modelSearchType
  },
  set(value) {
    emits('update:modelSearchType', value)
    if (search.value) {
      emits('search')
    }
  },
})

const filterOptions = [
  { label: 'All', value: '' },
  { label: 'Member', value: USER_ROLE.MEMBER },
  { label: 'Manager', value: USER_ROLE.MEMBER_MANAGER },
]

const searchOptions = [
  { label: 'Notepage name', value: 'pageName' },
  { label: 'Note name', value: 'noteKey' },
  { label: 'Notepage ID', value: 'notePageId' },
  { label: 'Note content', value: 'noteValue' },
]

function onSearch() {
  emits('search')
}
</script>

<style lang="scss">
.project-notepages-filter {
  .q-btn--outline:before {
    border: 1px solid $grey-5;
  }

  &__filter {
    border: 1px solid $grey-5;
  }

  &__filter .q-btn {
    flex-grow: 1;
  }

  &__search-type .q-field__control {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center !important;
  }
}
</style>
