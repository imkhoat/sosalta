<template>
  <q-card class="file-system-locked-card">
    <q-card-section>
      <q-section-header
        title="The file is Locked !"
        sub-title="This file has been linked from the following Notes:"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <q-list
        bordered
        separator
        class="rounded-borders q-mb-md"
      >
        <q-item
          v-for="(note, index) in linkedNotes"
          :key="index + '__file-system-locked-card'"
        >
          <q-item-section>
            <q-item-label>{{ note.pageName }}</q-item-label>
            <q-item-label caption>PageID: {{ note.pageID }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-alert :type="'warning'">
        Note: all links to this file from Notes must be removed before a file
        can be "unlocked" ( e.g., deleted, renamed, or moved).
      </q-alert>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ActionProp } from 'src/core/types/action-prop-types'

import { useFileSystemStore } from 'src/core/stores/file-system'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { httpsGetLinkedNotes } from 'src/core/services/project-services'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

// composables
const { t } = useI18n()
const { getActiveObject } = storeToRefs(useFileSystemStore())
// data
const loading = ref(false)
const linkedNotes = ref<{ pageName: string; pageID: string }[]>([])

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

async function fetchLinkedNotes() {
  try {
    if (!getActiveObject.value?.id) {
      throw new Error('Related file error or not exist')
    }

    const fileId = getActiveObject.value?.id

    const data = await httpsGetLinkedNotes(fileId)
    if (data?.code === RESPONSE_CODE.SUCCESS) {
      linkedNotes.value = data?.data
    }
  } catch (error) {
    throw error
  }
}

// hooks
onMounted(async () => {
  loading.value = true
  await fetchLinkedNotes()
  loading.value = false
})
</script>
<style lang="scss">
.file-system-locked-card {
  min-width: 300px;
}
</style>
