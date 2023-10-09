<template>
  <div class="row justify-end items-center full-width q-gutter-x-sm no-wrap">
    <q-btn
      v-if="isSelectedUser && hasDataDriveDeleteActionVisible"
      outline
      unelevated
      color="primary"
      @click="onDeleteDataDrives"
    >
      <q-icon
        size="xs"
        name="sym_o_delete"
        class="q-mr-xs"
      ></q-icon
      >Delete data drive
    </q-btn>
    <q-btn
      push
      color="primary"
      v-if="hasDataDriveCreateActionVisible"
      @click="onCreateNewDataDrive"
    >
      <q-icon
        size="xs"
        name="sym_o_add"
        class="q-mr-xs"
      ></q-icon>
      {{ isMobile ? 'New data drive' : 'Create new data drive' }}
    </q-btn>
    <cloud-pc-menus></cloud-pc-menus>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useCloudPCDataDrives } from 'src/pages/cloud-pc/hooks/use-data-drive'
import CloudPcMenus from 'src/pages/cloud-pc/components/cloud-pc-menus.vue'
import { useMenusVisible } from 'src/pages/cloud-pc/hooks/use-menus-visible'

// composables
const $q = useQuasar()
const { selectedDataDrives, onCreateNewDataDrive, onDeleteDataDrives } =
  useCloudPCDataDrives()
const { hasDataDriveCreateActionVisible, hasDataDriveDeleteActionVisible } =
  useMenusVisible()
// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
const isSelectedUser = computed(() => {
  return selectedDataDrives?.value?.length > 0
})
</script>
