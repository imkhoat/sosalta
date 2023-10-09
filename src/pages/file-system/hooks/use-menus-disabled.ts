import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { STORAGE_FILE_STATUS } from 'src/core/types/file-types'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { DECOMPRESS_TYPES_SUPPORT } from 'src/core/utils/file-type-support'

export function useMenusDisabled() {
  const { getActiveObject, getRootDirType, getSelectedObjects } = storeToRefs(
    useFileSystemStore()
  )
  const { getUserAuthorization } = storeToRefs(useAuthStore())

  const isAllSysFolderObjects = computed(() => {
    return getSelectedObjects.value?.every(
      (item) => item.fileType === 'sys-folder'
    )
  })

  const isSomeSysFolderObjects = computed(() => {
    return getSelectedObjects.value?.some(
      (item) => item.fileType === 'sys-folder'
    )
  })

  const _fileSystemFunctions = computed(() => {
    return getUserAuthorization.value.fileSystemPage.functions
  })

  const hasEncryptContextDisabled = computed(() => {
    return getRootDirType.value?.type === 'ENCRYPT'
  })

  const hasDecryptContextDisabled = computed(() => {
    return getRootDirType.value?.type !== 'ENCRYPT'
  })

  const hasDecompressContextDisabled = computed(() => {
    if (getActiveObject.value?.fileType) {
      return (
        !DECOMPRESS_TYPES_SUPPORT.includes(
          getActiveObject.value?.fileType?.toLowerCase()
        ) && getRootDirType.value?.type !== 'ENCRYPT'
      )
    }
    return true
  })

  const hasLockedContextDisabled = computed(() => {
    return getActiveObject.value?.status !== STORAGE_FILE_STATUS.LOCKING
  })

  const hasDownloadContextDisabled = computed(() => {
    return false
  })

  const hasCopyContextDisabled = computed(() => {
    return false
  })

  const hasMoveContextDisabled = computed(() => {
    return false
  })

  const hasShareContextDisabled = computed(() => {
    return false
  })

  const hasDeleteContextDisabled = computed(() => {
    return false
  })

  const hasRenameContextDisabled = computed(() => {
    return false
  })

  const hasInfoContextDisabled = computed(() => {
    return false
  })

  const hasViewContextDisabled = computed(() => {
    return false
  })

  const hasEditContextDisabled = computed(() => {
    return false
  })

  const hasRecycleBinPushBackContextDisabled = computed(() => {
    return false
  })

  const hasRecycleBinDeleteContextDisabled = computed(() => {
    return false
  })

  const hasShareActionDisabled = computed(() => {
    return (
      getRootDirType.value?.type === 'ENCRYPT' ||
      isAllSysFolderObjects.value ||
      isSomeSysFolderObjects.value
    )
  })

  const hasUploadFileActionDisabled = computed(() => {
    return getRootDirType.value?.type === 'ENCRYPT'
  })

  const hasUploadFolderActionDisabled = computed(() => {
    return getRootDirType.value?.type === 'ENCRYPT'
  })

  const hasImportActionDisabled = computed(() => {
    return getRootDirType.value?.type === 'ENCRYPT'
  })

  const hasNewFolderActionDisabled = computed(() => {
    return false
  })

  const hasNewFileActionDisabled = computed(() => {
    return getRootDirType.value?.type === 'ENCRYPT'
  })

  const hasDownloadActionDisabled = computed(() => {
    return isAllSysFolderObjects.value || isSomeSysFolderObjects.value
  })

  const hasCopyActionDisabled = computed(() => {
    return isAllSysFolderObjects.value || isSomeSysFolderObjects.value
  })

  const hasMoveActionDisabled = computed(() => {
    return isAllSysFolderObjects.value || isSomeSysFolderObjects.value
  })

  const hasDeleteActionDisabled = computed(() => {
    return isAllSysFolderObjects.value || isSomeSysFolderObjects.value
  })

  const hasRecycleBinEmptyTrashActionDisabled = computed(() => {
    return false
  })

  const hasRecycleBinPushBackActionDisabled = computed(() => {
    return false
  })

  const hasRecycleBinDeleteActionDisabled = computed(() => {
    return false
  })

  return {
    hasRecycleBinEmptyTrashActionDisabled,
    hasRecycleBinPushBackActionDisabled,
    hasRecycleBinDeleteActionDisabled,
    _fileSystemFunctions,
    hasDecryptContextDisabled,
    hasEncryptContextDisabled,
    hasDecompressContextDisabled,
    hasLockedContextDisabled,
    hasDownloadContextDisabled,
    hasCopyContextDisabled,
    hasMoveContextDisabled,
    hasShareContextDisabled,
    hasDeleteContextDisabled,
    hasRenameContextDisabled,
    hasInfoContextDisabled,
    hasViewContextDisabled,
    hasEditContextDisabled,
    hasShareActionDisabled,
    hasUploadFileActionDisabled,
    hasUploadFolderActionDisabled,
    hasImportActionDisabled,
    hasNewFolderActionDisabled,
    hasNewFileActionDisabled,
    hasDownloadActionDisabled,
    hasCopyActionDisabled,
    hasMoveActionDisabled,
    hasDeleteActionDisabled,
    hasRecycleBinPushBackContextDisabled,
    hasRecycleBinDeleteContextDisabled,
  }
}
