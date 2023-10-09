import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { StorageFile } from 'src/core/types/file-types'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { useNavigate } from 'src/pages/file-system/hooks/use-navigate'

const modal = reactive<{
  open: boolean
  type:
    | 'INFO_MODAL'
    | 'VIEW_MODAL'
    | 'VIEW_ACTIVE_MODAL'
    | 'RENAME_MODAL'
    | 'SHARE_MODAL'
    | 'NEW_FOLDER_MODAL'
    | 'NEW_FILE_MODAL'
    | 'SHARE_ACTIVE_MODAL'
    | 'DELETE_MODAL'
    | 'DELETE_ACTIVE_MODAL'
    | 'DOWNLOAD_MODAL'
    | 'DOWNLOAD_ACTIVE_MODAL'
    | 'LOCKED_MODAL'
    | 'DECOMPRESS_MODAL'
    | 'COPY_MODAL'
    | 'COPY_ACTIVE_MODAL'
    | 'MOVE_MODAL'
    | 'MOVE_ACTIVE_MODAL'
    | 'EDIT_ACTIVE_MODAL'
    | 'DECRYPT_MODAL'
    | 'ENCRYPT_MODAL'
    | 'IMPORT_MODAL'
    | 'UPLOAD_FILE_MODAL'
    | 'UPLOAD_FOLDER_MODAL'
    | 'CHANGE_STORAGE_TYPE_ACTIVE_MODAL'
    | 'CONVERTING_ACTIVE_MODAL'
    | 'RECYCLE_BIN_PUSH_BACK_ACTIVE_MODAL'
    | 'RECYCLE_BIN_PUSH_BACK_MODAL'
    | 'RECYCLE_BIN_DELETE_ACTIVE_MODAL'
    | 'RECYCLE_BIN_DELETE_MODAL'
    | 'RECYCLE_BIN_EMPTY_TRASH_MODAL'
}>({
  open: false,
  type: 'INFO_MODAL',
})

export function useMenusActions() {
  const { getRootDirType, getDefaultRootFolder, getEncryptedFolderId } =
    storeToRefs(useFileSystemStore())
  const { setActiveObject, turnProtectedOn, setParent } = useFileSystemStore()
  const { handleNavigateFileSystem } = useNavigate()

  // methods
  function onUploadFile() {
    modal.type = 'UPLOAD_FILE_MODAL'
    modal.open = true
  }

  function onUploadFolder() {
    modal.type = 'UPLOAD_FOLDER_MODAL'
    modal.open = true
  }

  function onImportFiles() {
    modal.type = 'IMPORT_MODAL'
    modal.open = true
  }

  function onCreateNewFile() {
    modal.type = 'NEW_FILE_MODAL'
    modal.open = true
  }

  function onCreateNewFolder() {
    modal.type = 'NEW_FOLDER_MODAL'
    modal.open = true
  }

  function onDownload() {
    modal.type = 'DOWNLOAD_MODAL'
    modal.open = true
  }

  function onContextDownload() {
    modal.type = 'DOWNLOAD_ACTIVE_MODAL'
    modal.open = true
  }

  function onCopy() {
    modal.type = 'COPY_MODAL'
    modal.open = true
  }

  function onContextCopy() {
    modal.type = 'COPY_ACTIVE_MODAL'
    modal.open = true
  }

  function onMove() {
    modal.type = 'MOVE_MODAL'
    modal.open = true
  }

  function onContextMove() {
    modal.type = 'MOVE_ACTIVE_MODAL'
    modal.open = true
  }

  function onRename() {
    modal.type = 'RENAME_MODAL'
    modal.open = true
  }

  function onShare() {
    modal.type = 'SHARE_MODAL'
    modal.open = true
  }

  function onContextShare() {
    modal.type = 'SHARE_ACTIVE_MODAL'
    modal.open = true
  }

  function onDelete() {
    modal.type = 'DELETE_MODAL'
    modal.open = true
  }

  function onContextDeleteObject() {
    modal.type = 'DELETE_ACTIVE_MODAL'
    modal.open = true
  }

  function onShowInfo() {
    modal.type = 'INFO_MODAL'
    modal.open = true
  }

  function onContextEdit() {
    modal.type = 'EDIT_ACTIVE_MODAL'
    modal.open = true
  }

  function onView() {
    modal.type = 'VIEW_MODAL'
    modal.open = true
    console.log('onView')
  }

  function onEncrypt() {
    modal.type = 'ENCRYPT_MODAL'
    modal.open = true
  }

  function onDecrypt() {
    modal.type = 'DECRYPT_MODAL'
    modal.open = true
  }

  function onDecompress() {
    modal.type = 'DECOMPRESS_MODAL'
    modal.open = true
  }

  function onLocked() {
    modal.type = 'LOCKED_MODAL'
    modal.open = true
  }

  function onRecycleBinPushBack() {
    modal.type = 'RECYCLE_BIN_PUSH_BACK_MODAL'
    modal.open = true
  }

  function onRecycleBinDelete() {
    modal.type = 'RECYCLE_BIN_DELETE_MODAL'
    modal.open = true
  }

  function onRecycleBinEmptyTrash() {
    modal.type = 'RECYCLE_BIN_EMPTY_TRASH_MODAL'
    modal.open = true
  }

  function onContextRecycleBinPushBack() {
    modal.type = 'RECYCLE_BIN_PUSH_BACK_ACTIVE_MODAL'
    modal.open = true
  }

  function onContextRecycleBinDelete() {
    modal.type = 'RECYCLE_BIN_DELETE_ACTIVE_MODAL'
    modal.open = true
  }

  function onToggleModal() {
    modal.open = !modal.open
  }

  function onContextView() {
    modal.type = 'VIEW_ACTIVE_MODAL'
    modal.open = true
  }

  function onChangeStorageClass(object: StorageFile) {
    setActiveObject(object)
    modal.type = 'CHANGE_STORAGE_TYPE_ACTIVE_MODAL'
    modal.open = true
  }

  function onShowConvertingMessage(object: StorageFile) {
    setActiveObject(object)
    modal.type = 'CONVERTING_ACTIVE_MODAL'
    modal.open = true
  }

  function onContextDownloadDirect(object: StorageFile) {
    setActiveObject(object)
    modal.type = 'DOWNLOAD_ACTIVE_MODAL'
    modal.open = true
  }

  function onContextShareDirect(object: StorageFile) {
    setActiveObject(object)
    modal.type = 'SHARE_ACTIVE_MODAL'
    modal.open = true
  }

  function onClickObject(object: StorageFile) {
    if (
      object?.fileType === 'sys-folder' &&
      object.id ===
        getDefaultRootFolder.value.get(getEncryptedFolderId.value)?.id
    ) {
      setParent(object)
      turnProtectedOn()
      handleNavigateFileSystem(object.rootDirType, object.id)
      return
    } else if (
      object?.fileType === 'folder' &&
      getRootDirType.value?.type === 'ENCRYPT'
    ) {
      setParent(object)
      handleNavigateFileSystem(object.rootDirType, object.id)
    } else if (
      object?.fileType === 'sys-folder' ||
      object?.fileType === 'folder'
    ) {
      setParent(object)
      handleNavigateFileSystem(object.rootDirType, object.id)
    }
  }

  return {
    modal,
    onMove,
    onCopy,
    onView,
    onContextEdit,
    onShare,
    onRename,
    onDelete,
    onLocked,
    onEncrypt,
    onDecrypt,
    onDownload,
    onShowInfo,
    onDecompress,
    onContextView,
    onContextCopy,
    onContextMove,
    onContextShare,
    onUploadFile,
    onToggleModal,
    onClickObject,
    onImportFiles,
    onUploadFolder,
    onCreateNewFile,
    onContextDownload,
    onCreateNewFolder,
    onRecycleBinPushBack,
    onRecycleBinDelete,
    onChangeStorageClass,
    onContextShareDirect,
    onContextDeleteObject,
    onRecycleBinEmptyTrash,
    onShowConvertingMessage,
    onContextDownloadDirect,
    onContextRecycleBinDelete,
    onContextRecycleBinPushBack,
  }
}
