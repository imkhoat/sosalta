<template>
  <div
    class="row justify-end items-center q-col-gutter-sm q-pagination-box no-wrap text-no-wrap"
  >
    <span class="text-caption">Records per page:</span>
    <q-select
      dense
      borderless
      hide-bottom-space
      hide-hint
      v-model="pagination.rowsPerPage"
      :options="rowPerPagesOptions"
      option-value="value"
      @update:model-value="updateValue"
    ></q-select>
    <span class="text-caption">{{ currentPagePostion }}</span>
    <q-pagination
      class="q-pagination-box__pagination-control"
      flat
      direction-links
      input-class="q-pagination-box__hidden-input"
      v-model="pagination.page"
      :max="pagination.totalPages ?? 1"
      @update:model-value="updateValue"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

// props & emits
const props = defineProps<{
  modelValue: {
    sortBy: 'desc' | 'asc'
    descending: boolean
    page: number
    rowsPerPage: number
    rowsNumber: number
    totalPages: number
  }
}>()

const emits = defineEmits(['update:modelValue'])

// data
const pagination = ref<{
  sortBy: 'desc' | 'asc'
  descending: boolean
  page: number
  rowsPerPage: number | 'ALL'
  rowsNumber: number
  totalPages: number
}>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 10,
  totalPages: 0,
})

// computed
const currentPagePostion = computed(() => {
  const from =
    pagination.value.rowsPerPage === 'ALL'
      ? 0
      : (pagination.value.page - 1) * pagination.value.rowsPerPage
  const to =
    pagination.value.rowsPerPage === 'ALL'
      ? pagination.value.rowsNumber
      : pagination.value.page * pagination.value.rowsPerPage
  return `${from}-${to} of ${pagination.value.rowsNumber}`
})
const rowPerPagesOptions = computed(() => {
  return [5, 7, 10, 15, 20, 25, 50, 'ALL']
})

// methods
function updateValue() {
  emits('update:modelValue', pagination)
}

//watch
watch(
  () => props.modelValue,
  (newVal) => {
    pagination.value = newVal
  },
  {
    deep: true,
    immediate: true,
  }
)
</script>
<style lang="scss">
.q-pagination-box {
  &__hidden-input,
  &__pagination-control .q-field--dense {
    display: none;
  }
  &__pagination-control .q-pagination__middle {
    display: none;
  }
}
</style>
