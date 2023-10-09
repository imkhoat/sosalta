<template>
  <div
    class="row justify-between items-center member-users-filter q-gutter-y-md q-gutter-sm-x-md"
  >
    <q-btn-toggle
      v-model="filter"
      unelevated
      size="md"
      toggle-color="brand-05"
      toggle-text-color="brand"
      :options="filterOptions"
      class="text-normal col-grow col-md-auto member-users-filter__filter"
    />
    <q-input
      dense
      filled
      v-model="search"
      placeholder="Search..."
      class="rounded-borders bg-grey-1 col-grow col-md-auto"
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
import { TEAM_MEMBER_TYPE } from 'src/core/types/team-member-types'

// props & emits
const emits = defineEmits([
  'update:modelFilter',
  'update:modelValue',
  'close',
  'search',
  'select',
])
const props = defineProps<{ modelFilter?: string; modelValue?: string }>()

// computed
const filter = computed({
  get() {
    return props.modelFilter
  },
  set(value) {
    emits('update:modelFilter', value)
    emits('select', value)
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

const filterOptions = [
  { label: 'All', value: TEAM_MEMBER_TYPE.ALL },
  { label: 'Member', value: TEAM_MEMBER_TYPE.MEMBER },
  { label: 'Owner', value: TEAM_MEMBER_TYPE.OWNER },
  { label: 'Team Manager', value: TEAM_MEMBER_TYPE.TEAM_MANAGER },
]

// methods
function onStartSearch() {
  emits('search', search.value)
}
</script>

<style lang="scss">
.member-users-filter {
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
