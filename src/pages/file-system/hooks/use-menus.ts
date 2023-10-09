import { groupBy } from 'lodash'
import { computed } from 'vue'
import { useMenusActions } from 'src/pages/file-system/hooks/use-menus-actions'
import { useMenusVisible } from './use-menus-visible'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useMenusDisabled } from './use-menus-disabled'

export interface Menu {
  name: string
  icon: string
  action: () => void
  group: 'UPLOAD'
  type: 'MENU_BAR' | 'MENU_CONTEXT' | 'ALL'
  disabled?: boolean
  disabledTooltip?: string
  direct?: boolean
  visible?: boolean
  button?: ActionProp
}

export function useMenus() {
  const {
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
    onContextShareDirect,
    onContextDeleteObject,
    onContextDownloadDirect,
    onContextRecycleBinPushBack,
    onContextRecycleBinDelete,
    onRecycleBinEmptyTrash,
    onRecycleBinPushBack,
    onRecycleBinDelete,
  } = useMenusActions()

  const {
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
    hasRecycleBinPushBackContextVisible,
    hasRecycleBinDeleteContextVisible,
    hasRecycleBinPushBackActionVisible,
    hasRecycleBinDeleteActionVisible,
    hasRecycleBinEmptyTrashActionVisible,
  } = useMenusVisible()
  const {
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
    hasRecycleBinPushBackActionDisabled,
    hasRecycleBinDeleteActionDisabled,
    hasRecycleBinEmptyTrashActionDisabled,
  } = useMenusDisabled()
  // data
  const menus = computed(() => ({
    UPLOAD_FILE: {
      name: 'Upload files',
      icon: 'r_upload_file',
      action: onUploadFile,
      group: 'UPLOAD',
      type: 'MENU_BAR',
      disabled: hasUploadFileActionDisabled.value,
      visible: hasUploadFileActionVisible.value,
    },
    UPLOAD_FOLDER: {
      name: 'Upload folder',
      icon: 'r_drive_folder_upload',
      action: onUploadFolder,
      group: 'UPLOAD',
      type: 'MENU_BAR',
      disabled: hasUploadFolderActionDisabled.value,
      visible: hasUploadFolderActionVisible.value,
    },
    IMPORT: {
      name: 'Import',
      icon: 'r_import_export',
      action: onImportFiles,
      group: 'UPLOAD',
      type: 'MENU_BAR',
      disabled: hasImportActionDisabled.value,
      visible: hasImportActionVisible.value,
    },
    NEW_FOLDER: {
      name: 'New folder',
      icon: 'r_create_new_folder',
      action: onCreateNewFolder,
      group: 'NEW',
      type: 'MENU_BAR',
      disabled: hasNewFolderActionDisabled.value,
      visible: hasNewFolderActionVisible.value,
    },
    NEW_FILE: {
      name: 'New file',
      icon: 'r_note_add',
      action: onCreateNewFile,
      group: 'NEW',
      type: 'MENU_BAR',
      disabled: hasNewFileActionDisabled.value,
      visible: hasNewFileActionVisible.value,
    },
    ACTIONS_DOWNLOAD: {
      name: 'Download',
      icon: 'r_download',
      action: onDownload,
      group: 'ACTIONS',
      type: 'MENU_BAR',
      disabled: hasDownloadActionDisabled.value,
      visible: hasDownloadActionVisible.value,
    },
    ACTIONS_COPY: {
      name: 'Copy',
      icon: 'r_file_copy',
      action: onCopy,
      group: 'ACTIONS',
      type: 'MENU_BAR',
      disabled: hasCopyActionDisabled.value,
      visible: hasCopyActionVisible.value,
    },
    ACTIONS_MOVE: {
      name: 'Move',
      icon: 'r_drive_file_move',
      action: onMove,
      group: 'ACTIONS',
      type: 'MENU_BAR',
      disabled: hasMoveActionDisabled.value,
      visible: hasMoveActionVisible.value,
    },
    ACTIONS_SHARE: {
      name: 'Share',
      icon: 'r_share',
      action: onShare,
      group: 'ACTIONS',
      type: 'MENU_BAR',
      disabled: hasShareActionDisabled.value,
      visible: hasShareActionVisible.value,
    },
    ACTIONS_DELETE: {
      name: 'Delete',
      icon: 'r_delete',
      action: onDelete,
      group: 'ACTIONS',
      type: 'MENU_BAR',
      disabled: hasDeleteActionDisabled.value,
      visible: hasDeleteActionVisible.value,
    },
    ACTIONS_RECYCLE_BIN_EMPTY_TRASH: {
      name: 'Empty Trash',
      icon: 'r_recycling',
      action: onRecycleBinEmptyTrash,
      group: 'RECYCLE BIN',
      type: 'ACTIONS',
      disabled: hasRecycleBinEmptyTrashActionDisabled.value,
      direct: true,
      visible: hasRecycleBinEmptyTrashActionVisible.value,
    },
    ACTIONS_RECYCLE_BIN_PUSH_BACK: {
      name: 'Push back',
      icon: 'r_undo',
      action: onRecycleBinPushBack,
      group: 'RECYCLE BIN',
      type: 'ACTIONS',
      disabled: hasRecycleBinPushBackActionDisabled.value,
      direct: false,
      visible: hasRecycleBinPushBackActionVisible.value,
    },
    ACTIONS_RECYCLE_BIN_DELETE: {
      name: 'Delete',
      icon: 'r_delete_forever',
      action: onRecycleBinDelete,
      group: 'RECYCLE BIN',
      type: 'ACTIONS',
      disabled: hasRecycleBinDeleteActionDisabled.value,
      direct: false,
      visible: hasRecycleBinDeleteActionVisible.value,
    },
  }))

  const contextMenus = computed(() => ({
    ACTIONS_DOWNLOAD: {
      name: 'Download',
      icon: 'r_download',
      action: onContextDownload,
      group: 'ACTIONS',
      type: 'MENU_CONTEXT',
      disabled: hasDownloadContextDisabled.value,
      direct: true,
      visible: hasDownloadContextVisible.value,
    },
    ACTIONS_COPY: {
      name: 'Copy',
      icon: 'r_file_copy',
      action: onContextCopy,
      group: 'ACTIONS',
      type: 'MENU_CONTEXT',
      disabled: hasCopyContextDisabled.value,
      direct: false,
      visible: hasCopyContextVisible.value,
    },
    ACTIONS_MOVE: {
      name: 'Move',
      icon: 'r_drive_file_move',
      action: onContextMove,
      group: 'ACTIONS',
      type: 'MENU_CONTEXT',
      disabled: hasMoveContextDisabled.value,
      direct: false,
      visible: hasMoveContextVisible.value,
    },
    ACTIONS_SHARE: {
      name: 'Share',
      icon: 'r_share',
      action: onContextShare,
      group: 'ACTIONS',
      type: 'MENU_CONTEXT',
      disabled: hasShareContextDisabled.value,
      direct: true,
      visible: hasShareContextVisible.value,
    },
    ACTIONS_DELETE: {
      name: 'Delete',
      icon: 'r_delete',
      action: onContextDeleteObject,
      group: 'ACTIONS',
      type: 'MENU_CONTEXT',
      disabled: hasDeleteContextDisabled.value,
      direct: false,
      visible: hasDeleteContextVisible.value,
    },
    ACTIONS_RENAME: {
      name: 'Rename',
      icon: 'r_border_color',
      action: onRename,
      group: 'ACTIONS',
      type: 'MENU_CONTEXT',
      disabled: hasRenameContextDisabled.value,
      direct: false,
      visible: hasRenameContextVisible.value,
    },
    ACTIONS_INFO: {
      name: 'Info',
      icon: 'r_info',
      action: onShowInfo,
      group: 'ACTIONS',
      type: 'MENU_CONTEXT',
      disabled: hasInfoContextDisabled.value,
      direct: false,
      visible: hasInfoContextVisible.value,
    },
    ACTIONS_VIEW: {
      name: 'View',
      icon: 'r_view_comfy',
      action: onContextView,
      group: 'ACTIONS',
      type: 'MENU_CONTEXT',
      disabled: hasViewContextDisabled.value,
      direct: false,
      visible: hasViewContextVisible.value,
    },
    ACTIONS_EDIT: {
      name: 'Edit',
      icon: 'r_mode',
      action: onContextEdit,
      group: 'ACTIONS',
      type: 'MENU_CONTEXT',
      disabled: hasEditContextDisabled.value,
      direct: false,
      visible: hasEditContextVisible.value,
    },
    ACTIONS_ENCRYPT: {
      name: 'Encrypt',
      icon: 'r_enhanced_encryption',
      action: onEncrypt,
      group: 'ENCRYPT',
      type: 'MENU_CONTEXT',
      disabled: hasEncryptContextDisabled.value,
      direct: false,
      visible: hasEncryptContextVisible.value,
    },
    ACTIONS_DECRYPT: {
      name: 'Decrypt',
      icon: 'r_no_encryption_gmailerrorred',
      action: onDecrypt,
      group: 'ENCRYPT',
      type: 'MENU_CONTEXT',
      disabled: hasDecryptContextDisabled.value,
      direct: false,
      visible: hasDecryptContextVisible.value,
    },
    ACTIONS_DECOMPRESS: {
      name: 'Decompress',
      icon: 'r_folder_zip',
      action: onDecompress,
      group: 'ENCRYPT',
      type: 'MENU_CONTEXT',
      disabled: hasDecompressContextDisabled.value,
      direct: false,
      visible: hasDecompressContextVisible.value,
    },
    ACTIONS_LOCKED: {
      name: 'Locked',
      icon: 'r_lock',
      action: onLocked,
      group: 'ENCRYPT',
      type: 'MENU_CONTEXT',
      disabled: hasLockedContextDisabled.value,
      direct: false,
      visible: hasLockedContextVisible.value,
    },
    ACTIONS_RECYCLE_BIN_PUSH_BACK: {
      name: 'Push back',
      icon: 'r_undo',
      action: onContextRecycleBinPushBack,
      group: 'RECYCLE BIN',
      type: 'MENU_CONTEXT',
      disabled: hasRecycleBinPushBackContextDisabled.value,
      direct: false,
      visible: hasRecycleBinPushBackContextVisible.value,
    },
    ACTIONS_RECYCLE_BIN_DELETE: {
      name: 'Delete',
      icon: 'r_delete_forever',
      action: onContextRecycleBinDelete,
      group: 'RECYCLE BIN',
      type: 'MENU_CONTEXT',
      disabled: hasRecycleBinDeleteContextDisabled.value,
      direct: false,
      visible: hasRecycleBinDeleteContextVisible.value,
    },
  }))

  const menusContextDirectAccess = computed(() => [
    {
      name: 'Download',
      icon: 'r_download',
      action: onContextDownloadDirect,
      group: 'ACTIONS',
      type: 'MENU_CONTEXT',
      disabled: hasDownloadContextDisabled.value,
      direct: true,
      visible: hasDownloadContextVisible.value,
    },
    {
      name: 'Share',
      icon: 'r_share',
      action: onContextShareDirect,
      group: 'ACTIONS',
      type: 'MENU_CONTEXT',
      disabled: hasShareContextDisabled.value,
      direct: true,
      visible: hasShareContextVisible.value,
    },
  ])

  const menusBarDirectAccess = computed(() => [
    {
      name: 'Share',
      icon: 'r_share',
      action: onShare,
      group: 'ACTIONS',
      type: 'MENU_BAR',
      disabled: hasShareActionDisabled.value,
      direct: true,
      visible: hasShareActionVisible.value,
      button: {
        outline: true,
        unelevated: true,
        color: 'primary',
      },
    },
    {
      name: 'Upload File',
      icon: 'r_upload_file',
      action: onUploadFile,
      group: 'UPLOAD',
      type: 'MENU_BAR',
      disabled: hasUploadFileActionDisabled.value,
      direct: true,
      visible: hasUploadFileActionVisible.value,
      button: {
        outline: false,
        unelevated: true,
        color: 'primary',
      },
    },
    {
      name: 'Empty Trash',
      icon: 'r_recycling',
      action: onRecycleBinEmptyTrash,
      group: 'RECYCLE BIN',
      type: 'MENU_BAR',
      disabled: hasRecycleBinEmptyTrashActionDisabled.value,
      direct: true,
      visible: hasRecycleBinEmptyTrashActionVisible.value,
      button: {
        outline: false,
        unelevated: true,
        color: 'negative',
      },
    },
  ])

  // computed
  const menusArray = computed(() => {
    return Object.values(menus.value) as Menu[]
  })

  const visibleMenusArray = computed(() => {
    return Object.values(menus.value).filter((menu) => {
      return menu.visible
    }) as Menu[]
  })

  const menusContextArray = computed(() => {
    return Object.values(contextMenus.value) as Menu[]
  })

  const visibleMenusContextArray = computed(() => {
    return Object.values(contextMenus.value).filter((menu) => {
      return menu.visible
    }) as Menu[]
  })

  const visibleMenusBarDirectAccessArray = computed(() => {
    return menusBarDirectAccess.value.filter((menu) => {
      return menu.visible
    }) as Menu[]
  })

  const visibleMenusContextDirectAccess = computed(() => {
    return menusContextDirectAccess.value.filter((menu) => {
      return menu?.visible
    })
  })
  const menusByGroup = computed(() => {
    const menusGroup = groupBy(menusArray.value, (x: Menu) => x.group)
    return Object.keys(menusGroup).map((item) => {
      return {
        group: item,
        menus: menusGroup[item],
      }
    })
  })

  const menusContextByGroup = computed(() => {
    const menusGroup = groupBy(
      visibleMenusContextArray.value,
      (x: Menu) => x.group
    )
    return Object.keys(menusGroup).map((item) => {
      return {
        group: item,
        menus: menusGroup[item],
      }
    })
  })

  const menusBarByGroup = computed(() => {
    const menusGroup = groupBy(visibleMenusArray.value, (x: Menu) => x.group)
    return Object.keys(menusGroup).map((item) => {
      return {
        group: item,
        menus: menusGroup[item],
      }
    })
  })

  return {
    modal,
    menusArray,
    menusByGroup,
    menusBarByGroup,
    visibleMenusArray,
    menusContextArray,
    menusContextByGroup,
    menusBarDirectAccess,
    visibleMenusContextArray,
    menusContextDirectAccess,
    visibleMenusContextDirectAccess,
    visibleMenusBarDirectAccessArray,
    onView,
    onShare,
    onUploadFile,
    onToggleModal,
    onClickObject,
  }
}
