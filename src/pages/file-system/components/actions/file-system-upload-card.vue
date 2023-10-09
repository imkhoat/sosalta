<template>
  <q-card class="file-system-upload-card">
    <q-card-section>
      <q-section-header
        title="Upload files"
        sub-title="Select files and click upload"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <file-system-select-files
        :upload-type="uploadType"
        :model-value="selectedFiles"
        :multiple="true"
        @change="onFileChange($event)"
      ></file-system-select-files>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useS3Store } from 'src/core/stores/s3-stores'
import { ActionProp } from 'src/core/types/action-prop-types'

import { UploadFolder } from 'src/core/types/upload-folder'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { useUpload } from 'src/pages/file-system/hooks/use-upload'

import FileSystemSelectFiles from 'src/pages/file-system/components/upload/file-system-select-files.vue'
import { UploadFile } from 'src/core/types/upload-file'
import { AtlasFileSystem } from 'src/core/types/file-types'

// props & emits
withDefaults(
  defineProps<{
    uploadType: 'UPLOAD_FOLDER_MODAL' | 'UPLOAD_FILE_MODAL'
    fileSystemType: AtlasFileSystem
  }>(),
  {
    uploadType: 'UPLOAD_FILE_MODAL',
    fileSystemType: 'DEFAULT_FILE_SYSTEM',
  }
)
const emits = defineEmits(['close', 'upload'])

// composables
const { t } = useI18n()
const { getParentId } = storeToRefs(useFileSystemStore())
const { getUploadFilesName, getUploadFiles } = storeToRefs(useS3Store())
const { setUploadFiles, setUploadFolders } = useS3Store()
const { handleHasDupplicateCheck, handleHasAvailableBalance, loading } =
  useUpload()

const formValid = ref(false)
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
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Upload'),
      action: onStartUpload,
      loading: loading.value,
      disable: !formValid.value,
    },
  ]
})

const selectedFiles = computed(() => {
  return getUploadFiles.value?.map((item) => {
    return item?.file
  })
})
// methods
function onClose() {
  emits('close')
}

function onStartUpload() {
  emits('upload')
}

function _getFolderArr(
  payload: FileList | undefined | null,
  currentParentId: string | undefined
) {
  if (payload) {
    let folders = Array.from(payload)?.map((file) => {
      const lastIndexOfSlash = file?.webkitRelativePath.lastIndexOf('/')
      const path = file?.webkitRelativePath.substring(0, lastIndexOfSlash)
      const parentPath = path.substring(0, path?.lastIndexOf('/'))
      const folderTemps = path?.split('/')
      const level = folderTemps?.length
      const parentId = level <= 1 ? currentParentId : ''
      const folderName = folderTemps.at(-1)

      return {
        name: folderName,
        path,
        parentPath,
        parentId,
        level,
      } as UploadFolder
    })
    folders = [...new Map(folders.map((item) => [item.path, item])).values()]
    return folders
  }
  return []
}

function _getFileArr(payload: FileList | undefined | null) {
  if (!payload) return []
  const files = Array.from(payload)?.map((file: File) => {
    return {
      file: file,
      parentId: getParentId.value,
      status: 'OPEN',
    } as UploadFile
  })
  return files
}

function onFileChange(event: FileList | undefined | null) {
  setUploadFolders(_getFolderArr(event, getParentId.value))
  setUploadFiles(_getFileArr(event))
  if (getUploadFilesName.value) {
    Promise.all([
      handleHasAvailableBalance(),
      handleHasDupplicateCheck(getUploadFilesName.value),
    ]).then((values) => {
      formValid.value = values.every((item) => item === true)
    })
  }
}
</script>
<style lang="scss">
.file-system-upload-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
  &__list {
    max-height: 500px;
    overflow: hidden;
    overflow-y: scroll;
  }
}
</style>
