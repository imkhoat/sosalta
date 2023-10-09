<template>
  <q-card class="file-system-copy-card">
    <q-form
      ref="fileSystemCopyCard"
      no-error-focus
      :autofocus="false"
      @submit="onCopy"
    >
      <q-card-section>
        <q-section-header
          title="Copy file"
          sub-title="Select the folder to store the copied file"
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
            <q-tab
              name="DATA_DRIVE"
              label="Data Drive"
              class="text-caption"
            />
            <q-tab
              name="PROJECT"
              label="Project"
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
            v-else-if="selectedTab === 'TEAM'"
            class="q-my-md"
            v-model="selectedFolder"
            v-model:model-object="selectedFolderObject"
            :root-id="getActiveUserName"
            :root-name="getActiveUserName"
            :user-name="folderTreeProps.userName"
          ></q-team-folder-tree>
          <q-data-drive-folder-tree
            v-else-if="selectedTab === 'DATA_DRIVE'"
            class="q-my-md"
            v-model="selectedFolder"
            v-model:model-object="selectedFolderObject"
            :root-id="getActiveUserName"
            :root-name="getActiveUserName"
            :user-name="folderTreeProps.userName"
          ></q-data-drive-folder-tree>
          <q-project-folder-tree
            v-else
            class="q-my-md"
            v-model="selectedFolder"
            v-model:model-object="selectedFolderObject"
            :root-id="getActiveUserName"
            :root-name="getActiveUserName"
            :user-name="folderTreeProps.userName"
          ></q-project-folder-tree>
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
import { computed, ref } from 'vue'
import { errorHandler } from 'src/core/utils/error-handler'
import { FolderNode } from 'src/core/types/folder-node-types'
import { ActionProp } from 'src/core/types/action-prop-types'
import QTeamFolderTree from 'src/core/components/molecules/quasar-extends/q-team-folder-tree.vue'
import QProjectFolderTree from 'src/core/components/molecules/quasar-extends/q-project-folder-tree.vue'
import QDataDriveFolderTree from 'src/core/components/molecules/quasar-extends/q-data-drive-folder-tree.vue'
import { useFiles } from 'src/pages/file-system/hooks/use-files'
import { useFileSystemStore } from 'src/core/stores/file-system'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])
const props = defineProps<{
  copyType: 'COPY_MODAL' | 'COPY_ACTIVE_MODAL'
}>()

// composables
const { t } = useI18n()
const { getActiveUserName } = storeToRefs(useFileSystemStore())
const { handleCopyObjects, handleCopyActiveObject, loading } = useFiles()

// data
const selectedFolder = ref('')
const selectedTab = ref<'MY_FOLDER' | 'TEAM' | 'DATA_DRIVE' | 'PROJECT'>(
  'MY_FOLDER'
)
const selectedFolderObject = ref<FolderNode>()
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
      name: t('textActions.Copy'),
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}
async function onCopy() {
  try {
    if (!selectedFolder.value) {
      errorHandler.notify('Please select target folder')
      return
    }
    if (props.copyType === 'COPY_ACTIVE_MODAL') {
      await handleCopyActiveObject(selectedFolder.value)
    } else {
      await handleCopyObjects(selectedFolder.value)
    }
    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.file-system-copy-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
