<template>
  <div
    class="row justify-between items-center cloudpc-machine-image-filter q-gutter-y-md q-gutter-sm-x-md"
  >
    <q-btn-toggle
      v-if="items?.length > 0"
      v-model="filter"
      unelevated
      size="md"
      toggle-color="brand-05"
      toggle-text-color="brand"
      :options="firstOptions"
      class="text-normal col-grow col-md-auto cloudpc-machine-image-filter__filter"
    >
      <q-btn-dropdown
        v-if="dropdownOptions?.length > 0"
        dropdown-icon="sym_o_more_vert"
        no-icon-animation
        rounded
        class="cloudpc-machine-image-filter__dropdown"
      >
        <q-list>
          <q-item
            clickable
            v-for="(user, index) in dropdownOptions"
            :key="index + '__cloudpc-machine-image-filter'"
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
import { MachineType } from 'src/core/types/machine-image-types'
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
  items: { label: string | undefined; value: string | undefined }[]
  machineType: MachineType
}>()

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

const firstOptions = computed(() => {
  return props.items?.slice(0, 3)
})

const dropdownOptions = computed(() => {
  return props.items?.slice(2)
})

// methods
function onStartSearch() {
  emits('search', search.value)
}
</script>

<style lang="scss">
.cloudpc-machine-image-filter {
  .q-btn--outline:before {
    border: 1px solid $grey-5;
  }

  &__filter {
    border: 1px solid $grey-5;
  }

  &__filter .q-btn {
    flex-grow: 1;
  }

  &__dropdown {
    width: 24px;
    flex-grow: 0 !important;
  }
}
</style>
