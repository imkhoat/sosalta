<template>
  <q-card
    flat
    class="q-pa-sm"
  >
    <q-card-section class="q-pb-none">
      <span class="text-caption text-disable">{{ title }}</span>
    </q-card-section>
    <q-card-section :class="{ 'q-px-none': isMobile }">
      <q-table
        bordered
        flat
        hide-bottom
        :rows="rows"
        :pagination="{ rowsPerPage: rows?.length }"
        table-header-class="bg-positive text-white text-uppercase text-weight-bold text-left"
        class="pricing-data-card"
        :columns="columns"
      >
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { computed } from 'vue'

const $q = useQuasar()

const props = defineProps<{
  columns: { name: string; label: string; field: string }[]
  rows: any[]
  title: string
}>()

const isMobile = computed(() => {
  return $q.screen.lt.sm
})
</script>
<style lang="scss">
.pricing-data-card {
  .q-table__top {
    background-color: #fafafa !important;
  }
}
</style>
