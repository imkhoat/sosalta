<template>
  <div
    class="row justify-end items-center operation-logging-filter q-gutter-y-md q-gutter-sm-x-md"
  >
    <q-input
      dense
      filled
      v-model="search"
      placeholder="Search..."
      class="rounded-borders bg-grey-1 col-grow col-md-6"
      @keypress.enter="onSearch"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-filter v-model="filterMenu">
      <q-card class="operation-logging-filter__content">
        <q-card-section class="q-pb-none">
          <span class="text-action text-disable">Filter</span>
        </q-card-section>
        <q-card-section>
          <q-checkbox
            v-model="status"
            label="Show completed payments only."
            @update:model-value="onChangeStatus"
          ></q-checkbox>
        </q-card-section>
        <q-card-actions>
          <q-form-actions :actions="formActions"></q-form-actions>
        </q-card-actions>
      </q-card>
    </q-filter>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ActionProp } from 'src/core/types/action-prop-types'

// composables
// props & emits
const emits = defineEmits(['update:modelValue', 'close', 'search', 'select'])
const props = withDefaults(
  defineProps<{
    modelValue: {
      status?: 'TRADE_SUCCESS' | null
      keyword?: string
    }
  }>(),
  {}
)
const status = ref(props.modelValue.status === 'TRADE_SUCCESS' ? true : false)
const filterMenu = ref(false)
// computed

const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: 'Cancel',
      action: onCancel,
    },
    {
      color: 'primary',
      flat: true,
      class: 'bg-grey-1',
      name: 'Search',
      action: onSearch,
    },
  ]
})
const search = computed({
  get() {
    return props.modelValue?.keyword
  },
  set(value) {
    emits('update:modelValue', {
      status: status.value,
      keyword: value,
    })
  },
})

// methods
function onCancel() {
  filterMenu.value = !filterMenu.value
}
function onSearch() {
  emits('search')
  onCancel()
}
function onChangeStatus() {
  emits('update:modelValue', {
    status: status.value ? 'TRADE_SUCCESS' : '',
    keyword: search?.value,
  })
}
</script>

<style lang="scss">
.operation-logging-filter {
  .q-btn--outline:before {
    border: 1px solid $grey-5;
  }

  &__filter {
    border: 1px solid $grey-5;
  }

  &__filter .q-btn {
    flex-grow: 1;
  }

  &__content {
    min-width: 300px;
  }
}
</style>
