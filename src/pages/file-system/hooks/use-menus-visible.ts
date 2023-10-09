import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { DIR_TYPE } from 'src/core/types/file-types'
import { useTeamStore } from 'src/core/stores/teams'
import { useProjectStore } from 'src/core/stores/projects'

export function useMenusVisible() {
  const { getUserAuthorization, isMainAccount } = storeToRefs(useAuthStore())
  const { getRootDirType } = storeToRefs(useFileSystemStore())
  const { getUserTeamAuthorization } = storeToRefs(useTeamStore())
  const { getUserProjectAuthorization } = storeToRefs(useProjectStore())

  const _fileSystemFunctions = computed(() => {
    switch (getRootDirType.value?.type) {
      case DIR_TYPE.TEAM:
        return getUserTeamAuthorization.value.fileSystemPage.functions
      case DIR_TYPE.PROJECT:
        return getUserProjectAuthorization.value.fileSystemPage.functions
      default:
        return getUserAuthorization.value.fileSystemPage.functions
    }
  })

  const hasEncryptContextVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.encrypt.visible) &&
      getRootDirType.value?.type !== 'TRASH' &&
      getRootDirType.value?.type !== 'ENCRYPT'
    )
  })

  const hasDecryptContextVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.decrypt.visible) &&
      getRootDirType.value?.type === 'ENCRYPT'
    )
  })

  const hasDecompressContextVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.decompress.visible) &&
      getRootDirType.value?.type !== 'TRASH' &&
      getRootDirType.value?.type !== 'ENCRYPT'
    )
  })

  const hasLockedContextVisible = computed(() => {
    return true && getRootDirType.value?.type !== 'TRASH'
  })

  const hasDownloadContextVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.download.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasCopyContextVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.copy.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasMoveContextVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.move.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasShareContextVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.share.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasDeleteContextVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.delete.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasRenameContextVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.rename.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasInfoContextVisible = computed(() => {
    return true && getRootDirType.value?.type !== 'TRASH'
  })

  const hasViewContextVisible = computed(() => {
    return true && getRootDirType.value?.type !== 'TRASH'
  })

  const hasEditContextVisible = computed(() => {
    return true && getRootDirType.value?.type !== 'TRASH'
  })

  const hasRecycleBinPushBackContextVisible = computed(() => {
    return (
      (isMainAccount.value ||
        _fileSystemFunctions.value.recycleBinPushBack.visible) &&
      getRootDirType.value?.type === 'TRASH'
    )
  })

  const hasRecycleBinDeleteContextVisible = computed(() => {
    return (
      (isMainAccount.value ||
        _fileSystemFunctions.value.recycleBinDelete.visible) &&
      getRootDirType.value?.type === 'TRASH'
    )
  })

  const hasShareActionVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.share.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasUploadFileActionVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.upload.visible) &&
      getRootDirType.value?.type !== 'ENCRYPT' &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasUploadFolderActionVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.upload.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasImportActionVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.import.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasNewFolderActionVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.newFolder.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasNewFileActionVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.newFile.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasDownloadActionVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.download.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasCopyActionVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.copy.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasMoveActionVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.move.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasDeleteActionVisible = computed(() => {
    return (
      (isMainAccount.value || _fileSystemFunctions.value.delete.visible) &&
      getRootDirType.value?.type !== 'TRASH'
    )
  })

  const hasRecycleBinEmptyTrashActionVisible = computed(() => {
    return (
      (isMainAccount.value ||
        _fileSystemFunctions.value.recycleBinEmptyTrash.visible) &&
      getRootDirType.value?.type === 'TRASH'
    )
  })

  const hasRecycleBinDeleteActionVisible = computed(() => {
    return (
      (isMainAccount.value ||
        _fileSystemFunctions.value.recycleBinDelete.visible) &&
      getRootDirType.value?.type === 'TRASH'
    )
  })

  const hasRecycleBinPushBackActionVisible = computed(() => {
    return (
      (isMainAccount.value ||
        _fileSystemFunctions.value.recycleBinPushBack.visible) &&
      getRootDirType.value?.type === 'TRASH'
    )
  })

  return {
    hasDecryptContextVisible,
    hasEncryptContextVisible,
    hasDecompressContextVisible,
    hasLockedContextVisible,
    hasDownloadContextVisible,
    hasCopyContextVisible,
    hasMoveContextVisible,
    hasShareContextVisible,
    hasDeleteContextVisible,
    hasRenameContextVisible,
    hasInfoContextVisible,
    hasViewContextVisible,
    hasEditContextVisible,
    hasShareActionVisible,
    hasUploadFileActionVisible,
    hasUploadFolderActionVisible,
    hasImportActionVisible,
    hasNewFolderActionVisible,
    hasNewFileActionVisible,
    hasDownloadActionVisible,
    hasCopyActionVisible,
    hasMoveActionVisible,
    hasDeleteActionVisible,
    hasRecycleBinDeleteContextVisible,
    hasRecycleBinPushBackContextVisible,
    hasRecycleBinEmptyTrashActionVisible,
    hasRecycleBinDeleteActionVisible,
    hasRecycleBinPushBackActionVisible,
  }
}
