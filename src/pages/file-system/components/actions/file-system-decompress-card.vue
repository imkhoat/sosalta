<template>
  <q-card class="file-system-decompress-card">
    <q-form
      ref="fileSystemDecompressCard"
      no-error-focus
      :autofocus="false"
      @submit="onDecompress"
    >
      <q-card-section>
        <q-section-header
          title="Decompress file"
          sub-title="Select the folder to store the extracted file"
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <div class="bg-grey-1 q-pa-xs rounded-borders">
          <q-tabs
            dense
            mobile-arrows
            outside-arrows
            v-model="selectedTab"
          >
            <q-tab
              name="MY_FOLDER"
              label="My folder"
              class="text-caption"
            />
            <q-tab
              name="TEAM"
              label="Team"
              class="text-caption"
            />
          </q-tabs>
          <q-separator></q-separator>
          <q-folder-tree
            v-if="selectedTab === 'MY_FOLDER'"
            class="q-my-md"
            v-model="selectedFolder"
            v-model:model-object="selectedFolderObject"
            :folder-id="folderTreeProps.folderId"
            :user-name="folderTreeProps.userName"
          ></q-folder-tree>
          <q-team-folder-tree
            v-else
            class="q-my-md"
            v-model="selectedFolder"
            v-model:model-object="selectedFolderObject"
            :root-id="getActiveUserName"
            :root-name="getActiveUserName"
          ></q-team-folder-tree>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { errorHandler } from 'src/core/utils/error-handler'
import { FolderNode } from 'src/core/types/folder-node-types'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { httpsGetUnzipSupportTypes } from 'src/core/services/storage-services'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useFiles } from 'src/pages/file-system/hooks/use-files'
import QTeamFolderTree from 'src/core/components/molecules/quasar-extends/q-team-folder-tree.vue'
import { useFileSystemStore } from 'src/core/stores/file-system'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

// composables
const { t } = useI18n()
const { getActiveUserName } = storeToRefs(useFileSystemStore())
const { handleDecompressObject, loading } = useFiles()

// data
const selectedFolder = ref('')
const selectedTab = ref<'MY_FOLDER' | 'TEAM'>('MY_FOLDER')
const selectedFolderObject = ref<FolderNode>()
const unzipSupportTypes = ref<{ type: string; typeId: number | string }[]>([])
const folderTreeProps = {
  folderId: getActiveUserName.value || '',
  userName: getActiveUserName.value || '',
}

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      mode: 'submit',
      color: 'primary',
      flat: true,
      name: t('textActions.Decompress'),
      action: onDecompress,
      loading: loading.value,
    },
  ]
})
const selectedPath = computed(() => {
  return selectedFolderObject.value?.filePathItems?.reduce(
    (previousValue, currentValue) => {
      previousValue = previousValue + '/' + currentValue.name
      return previousValue
    },
    ''
  )
})

// methods
function onClose() {
  emits('close')
}
async function onDecompress() {
  try {
    if (!selectedFolder.value) {
      errorHandler.notify('Please select target folder')
      return
    }
    await handleDecompressObject(selectedFolder.value, selectedPath.value || '')
    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

async function fetchUnzipSupportTypes() {
  try {
    const data = await httpsGetUnzipSupportTypes()

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      unzipSupportTypes.value = data?.data
    }
  } catch (error) {}
}

// hooks
onMounted(() => {
  Promise.all([fetchUnzipSupportTypes()])
})
</script>
<style lang="scss">
.file-system-decompress-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
