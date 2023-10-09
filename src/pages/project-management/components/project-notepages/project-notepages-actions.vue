<template>
  <div class="row justify-end items-center full-width q-gutter-x-sm no-wrap">
    <q-btn
      v-if="isSelectedUser"
      outline
      unelevated
      color="primary"
      @click="onDeleteNotepages"
    >
      <q-icon
        size="xs"
        name="sym_o_delete"
        class="q-mr-xs"
      ></q-icon
      >Delete notepages
    </q-btn>
    <q-btn
      push
      color="primary"
      @click="onCreateNewNotepage"
    >
      <q-icon
        size="xs"
        name="sym_o_add"
        class="q-mr-xs"
      ></q-icon>
      {{ isMobile ? 'New notepage' : 'Create new notepage' }}
    </q-btn>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useProjectNotepages } from 'src/pages/project-management/hooks/use-notepages'

// composables
const $q = useQuasar()
const { onCreateNewNotepage, onDeleteNotepages, selectedNotepages } =
  useProjectNotepages()

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
const isSelectedUser = computed(() => {
  return selectedNotepages?.value?.length > 0
})
</script>
