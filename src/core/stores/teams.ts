import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { Team } from 'src/core/types/team-types'
import { UserMenu } from '../types/user-menu'
import { PermissionCodeType } from '../types/permission-code-types'

export const useTeamStore = defineStore('team-store', () => {
  // state
  const activeTeam = useStorage(
    'team-store-activeTeam',
    {} as Team,
    sessionStorage
  )

  const flatUserMenus = useStorage(
    'team-store-flatUserMenus',
    new Map<PermissionCodeType, UserMenu>(),
    sessionStorage
  )

  // getter
  const getActiveTeam = computed(() => {
    return activeTeam.value
  })
  const getFlatUserMenus = computed(() => {
    return flatUserMenus.value
  })

  const getUserTeamAuthorization = computed(() => {
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
      cloudPCPage: {
        functions: {
          machinePublicImage: {
            visible: getFlatUserMenus.value.get('CP_PUBLIC_IMAGE_ACCESS')
              ?.checked,
            readonly: getFlatUserMenus.value.get('CP_PUBLIC_IMAGE_ACCESS')
              ?.visiable,
          },
          machinePrivateImage: {
            visible: getFlatUserMenus.value.get('CP_PRIVATE_IMAGE_ACCESS')
              ?.checked,
            readonly: getFlatUserMenus.value.get('CP_PRIVATE_IMAGE_ACCESS')
              ?.visiable,
          },
          dataDriveCreate: {
            visible: getFlatUserMenus.value.get('CP_CREATE_A_NEW_DATA_DRIVE')
              ?.checked,
            readonly: getFlatUserMenus.value.get('CP_CREATE_A_NEW_DATA_DRIVE')
              ?.visiable,
          },
          dataDriveRename: {
            visible: getFlatUserMenus.value.get('CP_RENAME_DATA_DRIVE')
              ?.checked,
            readonly: getFlatUserMenus.value.get('CP_RENAME_DATA_DRIVE')
              ?.visiable,
          },
          dataDriveDelete: {
            visible: getFlatUserMenus.value.get('CP_DELETE_EXISTING_DATA_DRIVE')
              ?.checked,
            readonly: getFlatUserMenus.value.get(
              'CP_DELETE_EXISTING_DATA_DRIVE'
            )?.visiable,
          },
          dataDriveActionUpload: {
            visible: getFlatUserMenus.value.get('CP_UPLOAD')?.checked,
            readonly: getFlatUserMenus.value.get('CP_UPLOAD')?.visiable,
          },
          dataDriveActionNewFolder: {
            visible: getFlatUserMenus.value.get('CP_NEW_FOLDER')?.checked,
            readonly: getFlatUserMenus.value.get('CP_NEW_FOLDER')?.visiable,
          },
          dataDriveActionNewFile: {
            visible: getFlatUserMenus.value.get('CP_NEW_FILE')?.checked,
            readonly: getFlatUserMenus.value.get('CP_NEW_FILE')?.visiable,
          },
          dataDriveActionCopy: {
            visible: getFlatUserMenus.value.get('CP_COPY')?.checked,
            readonly: getFlatUserMenus.value.get('CP_COPY')?.visiable,
          },
          dataDriveActionDelete: {
            visible: getFlatUserMenus.value.get('CP_DELETE')?.checked,
            readonly: getFlatUserMenus.value.get('CP_DELETE')?.visiable,
          },
          dataDriveActionMove: {
            visible: getFlatUserMenus.value.get('CP_MOVE')?.checked,
            readonly: getFlatUserMenus.value.get('CP_MOVE')?.visiable,
          },
          dataDriveActionRename: {
            visible: getFlatUserMenus.value.get('CP_RENAME')?.checked,
            readonly: getFlatUserMenus.value.get('CP_RENAME')?.visiable,
          },
          dataDriveActionShare: {
            visible: getFlatUserMenus.value.get('CP_SHARE')?.checked,
            readonly: getFlatUserMenus.value.get('CP_SHARE')?.visiable,
          },
          dataDriveActionDownload: {
            visible: getFlatUserMenus.value.get('CP_DOWNLOAD')?.checked,
            readonly: getFlatUserMenus.value.get('CP_DOWNLOAD')?.visiable,
          },
          dataDriveActionDecompress: {
            visible: getFlatUserMenus.value.get('CP_UNZIP_FILE')?.checked,
            readonly: getFlatUserMenus.value.get('CP_UNZIP_FILE')?.visiable,
          },
        },
      },
    }
  })

  // actions
  function setActiveTeam(payload: Team | null) {
    activeTeam.value = payload
  }

  function setFlatUserMenus(payload: UserMenu[]) {
    const flatPayload = _flatten(payload)
    flatPayload.forEach((element) => {
      flatUserMenus.value.set(element.code, element)
    })
  }

  function _flatten(payload: UserMenu[]): UserMenu[] {
    return payload.flatMap((item) => [item, ..._flatten(item.children || [])])
  }

  function _transformTeamDataToGeneralUserMenuType(payload: UserMenu[]) {
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
    activeTeam,
    getActiveTeam,
    getFlatUserMenus,
    getUserTeamAuthorization,
    setActiveTeam,
    setFlatUserMenus,
  }
})
