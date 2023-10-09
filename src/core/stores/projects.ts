import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { Project } from 'src/core/types/project-types'
import { UserMenu } from '../types/user-menu'
import { PermissionCodeType } from '../types/permission-code-types'

export const useProjectStore = defineStore('project-store', () => {
  // state
  const activeProject = useStorage(
    'project-store-activeProject',
    {} as Project,
    sessionStorage
  )

  const flatUserMenus = useStorage(
    'project-store-flatUserMenus',
    new Map<PermissionCodeType, UserMenu>(),
    sessionStorage
  )

  // getter
  const getActiveProject = computed(() => {
    return activeProject.value
  })
  const getFlatUserMenus = computed(() => {
    return flatUserMenus.value
  })

  const getUserProjectAuthorization = computed(() => {
    return {
      fileSystemPage: {
        functions: {
          download: {
            visible: getFlatUserMenus.value.get('FS_DOWNLOAD')?.checked,
            readonly: getFlatUserMenus.value.get('FS_DOWNLOAD')?.visiable,
          },
          upload: {
            visible: getFlatUserMenus.value.get('FS_UPLOAD')?.checked,
            readonly: getFlatUserMenus.value.get('FS_UPLOAD')?.visiable,
          },
          newFile: {
            visible: getFlatUserMenus.value.get('FS_NEW_FILE')?.checked,
            readonly: getFlatUserMenus.value.get('FS_NEW_FILE')?.visiable,
          },
          newFolder: {
            visible: getFlatUserMenus.value.get('FS_NEW_FOLDER')?.checked,
            readonly: getFlatUserMenus.value.get('FS_NEW_FOLDER')?.visiable,
          },
          move: {
            visible: getFlatUserMenus.value.get('FS_MOVE')?.checked,
            readonly: getFlatUserMenus.value.get('FS_MOVE')?.visiable,
          },
          copy: {
            visible: getFlatUserMenus.value.get('FS_COPY')?.checked,
            readonly: getFlatUserMenus.value.get('FS_COPY')?.visiable,
          },
          delete: {
            visible: getFlatUserMenus.value.get('FS_DELETE')?.checked,
            readonly: getFlatUserMenus.value.get('FS_DELETE')?.visiable,
          },
          rename: {
            visible: getFlatUserMenus.value.get('FS_RENAME')?.checked,
            readonly: getFlatUserMenus.value.get('FS_RENAME')?.visiable,
          },
          share: {
            visible: getFlatUserMenus.value.get('FS_SHARE')?.checked,
            readonly: getFlatUserMenus.value.get('FS_SHARE')?.visiable,
          },
          import: {
            visible: getFlatUserMenus.value.get('FS_IMPORT')?.checked,
            readonly: getFlatUserMenus.value.get('FS_IMPORT')?.visiable,
          },
          encrypt: {
            visible: getFlatUserMenus.value.get('FS_ONLINE_ENCRYPT')?.checked,
            readonly: getFlatUserMenus.value.get('FS_ONLINE_ENCRYPT')?.visiable,
          },
          decrypt: {
            visible: getFlatUserMenus.value.get('FS_ONLINE_ENCRYPT')?.checked,
            readonly: getFlatUserMenus.value.get('FS_ONLINE_ENCRYPT')?.visiable,
          },
          decompress: {
            visible: getFlatUserMenus.value.get('FS_ONLINE_DECOMPRESS')
              ?.checked,
            readonly: getFlatUserMenus.value.get('FS_ONLINE_DECOMPRESS')
              ?.visiable,
          },
          saveToOutsideProject: {
            visible: getFlatUserMenus.value.get('FS_SAVE_TO_OUTSIDE_PROJECT')
              ?.checked,
            readonly: getFlatUserMenus.value.get('FS_SAVE_TO_OUTSIDE_PROJECT')
              ?.visiable,
          },
          saveFromOutsideProject: {
            visible: getFlatUserMenus.value.get('FS_SAVE_FROM_OUTSIDE_PROJECT')
              ?.checked,
            readonly: getFlatUserMenus.value.get('FS_SAVE_FROM_OUTSIDE_PROJECT')
              ?.visiable,
          },
          changeFileType: {
            visible: getFlatUserMenus.value.get('FS_CHANGE_FILE_TYPE')?.checked,
            readonly: getFlatUserMenus.value.get('FS_CHANGE_FILE_TYPE')
              ?.visiable,
          },
          edit: {
            visible: getFlatUserMenus.value.get('FS_EDIT')?.checked,
            readonly: getFlatUserMenus.value.get('FS_EDIT')?.visiable,
          },
          recycleBinPushBack: {
            visible: getFlatUserMenus.value.get('RB')?.checked,
            readonly: getFlatUserMenus.value.get('RB')?.visiable,
          },
          recycleBinDelete: {
            visible: getFlatUserMenus.value.get('RB')?.checked,
            readonly: getFlatUserMenus.value.get('RB')?.visiable,
          },
          recycleBinEmptyTrash: {
            visible: getFlatUserMenus.value.get('RB')?.checked,
            readonly: getFlatUserMenus.value.get('RB')?.visiable,
          },
        },
      },
      notePage: {
        functions: {
          createNotePage: {
            visible: getFlatUserMenus.value.get('PF_NOTEPAGE_CREATE')?.checked,
            readonly:
              getFlatUserMenus.value.get('PF_NOTEPAGE_CREATE')?.visiable,
          },
          listNotePage: {
            visible: getFlatUserMenus.value.get('PF_NOTEPAGE_LIST')?.checked,
            readonly: getFlatUserMenus.value.get('PF_NOTEPAGE_LIST')?.visiable,
          },
          editNotePage: {
            visible: getFlatUserMenus.value.get('PF_NOTEPAGE_EDIT')?.checked,
            readonly: getFlatUserMenus.value.get('PF_NOTEPAGE_EDIT')?.visiable,
          },
          deleteNotePage: {
            visible: getFlatUserMenus.value.get('PF_NOTEPAGE_DELETE')?.checked,
            readonly:
              getFlatUserMenus.value.get('PF_NOTEPAGE_DELETE')?.visiable,
          },
          exportNotePage: {
            visible: getFlatUserMenus.value.get('PF_NOTEPAGE_EXPORT')?.checked,
            readonly:
              getFlatUserMenus.value.get('PF_NOTEPAGE_EXPORT')?.visiable,
          },
          copyNotePage: {
            visible: getFlatUserMenus.value.get('PF_NOTEPAGE_COPY')?.checked,
            readonly: getFlatUserMenus.value.get('PF_NOTEPAGE_COPY')?.visiable,
          },
          renameNotePage: {
            visible: getFlatUserMenus.value.get('PF_NOTEPAGE_RENAME')?.checked,
            readonly:
              getFlatUserMenus.value.get('PF_NOTEPAGE_RENAME')?.visiable,
          },
        },
      },
      note: {
        functions: {
          createNote: {
            visible: getFlatUserMenus.value.get('PF_NOTE_CREATE')?.checked,
            readonly: getFlatUserMenus.value.get('PF_NOTE_CREATE')?.visiable,
          },
          listNote: {
            visible: getFlatUserMenus.value.get('PF_NOTE_LIST')?.checked,
            readonly: getFlatUserMenus.value.get('PF_NOTE_LIST')?.visiable,
          },
          editNote: {
            visible: getFlatUserMenus.value.get('PF_NOTE_EDIT')?.checked,
            readonly: getFlatUserMenus.value.get('PF_NOTE_EDIT')?.visiable,
          },
          deleteNote: {
            visible: getFlatUserMenus.value.get('PF_NOTE_DELETE')?.checked,
            readonly: getFlatUserMenus.value.get('PF_NOTE_DELETE')?.visiable,
          },
          exportNote: {
            visible: getFlatUserMenus.value.get('PF_NOTE_EXPORT')?.checked,
            readonly: getFlatUserMenus.value.get('PF_NOTE_EXPORT')?.visiable,
          },
        },
      },
    }
  })

  // actions
  function setActiveProject(payload: Project | null) {
    activeProject.value = payload
  }

  function setFlatUserMenus(payload: UserMenu[]) {
    const flatPayload = _transformProjectDataToGeneralUserMenuType(
      _flatten(payload)
    )
    flatPayload.forEach((element) => {
      flatUserMenus.value.set(element.code, element)
    })
  }

  function _flatten(payload: UserMenu[]): UserMenu[] {
    return payload.flatMap((item) => [item, ..._flatten(item.children || [])])
  }

  function _transformProjectDataToGeneralUserMenuType(payload: UserMenu[]) {
    const idMap = new Map()

    idMap.set(701, 'FS_UPLOAD')
    idMap.set(702, 'FS_NEW_FOLDER')
    idMap.set(703, 'FS_NEW_FILE')
    idMap.set(704, 'FS_COPY')
    idMap.set(705, 'FS_MOVE')
    idMap.set(706, 'FS_DELETE')
    idMap.set(707, 'FS_RENAME')
    idMap.set(708, 'FS_DOWNLOAD')
    idMap.set(709, 'FS_SHARE')
    idMap.set(715, 'VM_LIST_TEAM_IMAGE_ACCESS')
    idMap.set(716, 'VM_ADD_TEAM_IMAGE_ACCESS')
    idMap.set(717, 'VM_DELETE_TEAM_IMAGE_ACCESS')
    idMap.set(718, 'VM_UPDATE_TEAM_IMAGE_ACCESS')
    idMap.set(719, 'VM_COPY_TEAM_IMAGE_ACCESS')
    idMap.set(720, 'VM_MOVE_TEAM_IMAGE_ACCESS')
    idMap.set(721, 'VM_SAVE_TEAM_IMAGE_TO_OUTSIDE_ACCESS')
    idMap.set(722, 'VM_SAVE_TEAM_IMAGE_FROM_OUTSIDE_ACCESS')
    idMap.set(822, 'FS_CHANGE_FILE_TYPE')
    idMap.set(823, 'FS_EDIT')
    idMap.set(824, 'FS_ONLINE_DECOMPRESS')
    idMap.set(828, 'FS_SAVE_TO_OUTSIDE')
    idMap.set(829, 'FS_SAVE_FROM_OUTSIDE')

    return payload.map((item) => {
      return {
        ...item,
        code: idMap.get(item.id),
      }
    })
  }

  return {
    activeProject,
    getActiveProject,
    getFlatUserMenus,
    getUserProjectAuthorization,
    setActiveProject,
    setFlatUserMenus,
  }
})
