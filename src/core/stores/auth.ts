import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { UserInfo } from 'src/core/types/user-info'
import { UserMenu } from 'src/core/types/user-menu'
import { useCookies } from '@vueuse/integrations/useCookies'
import { PermissionCodeType } from '../types/permission-code-types'

type AuthState = {
  authentication?: boolean
  bucketName?: string
  region?: string
  userInfo?: UserInfo
  userMenus?: UserMenu[]
  masterPassword?: string
  fileSystemKey?: string
}

export const useAuthStore = defineStore('auth', () => {
  // state
  const authentication = useStorage(
    'auth-authentication',
    false,
    sessionStorage
  )
  const bucketName = useStorage('auth-bucketName', '', sessionStorage)
  const region = useStorage('auth-region', '', sessionStorage)
  const userInfo = useStorage(
    'auth-userInfo',
    {} as Partial<UserInfo>,
    sessionStorage
  )
  const userMenus = useStorage(
    'auth-userMenus',
    new Map<PermissionCodeType, UserMenu>(),
    sessionStorage
  )
  const flatUserMenus = useStorage(
    'auth-flatUserMenus',
    new Map<PermissionCodeType, UserMenu>(),
    sessionStorage
  )
  const {
    get: getAtlasAuthTokenCookies,
    set: setAtlasAuthTokenCookies,
    remove: removeAtlasAuthTokenCookies,
  } = useCookies(['atlas-auth-token'], {
    doNotParse: false,
    autoUpdateDependencies: false,
  })
  const masterPassword = ref('')
  const fileSystemKey = ref('')

  //getters
  const isAuthenticated = computed(() => {
    return authentication.value
  })

  const getUserName = computed(() => {
    return userInfo.value.userName
  })

  const getTrueName = computed(() => {
    return userInfo.value.trueName
  })

  const getUserInformation = computed(() => {
    return userInfo.value
  })

  const getUserMenus = computed(() => {
    return userMenus.value
  })

  const getFlatUserMenus = computed(() => {
    return flatUserMenus.value
  })

  const getUserMenusArr = computed(() => {
    return Array.from(userMenus.value.values())
  })
  const isMainAccount = computed(() => {
    return userInfo?.value?.roleName === 'orgAdmin'
  })

  const getMasterPassword = computed(() => {
    return masterPassword.value
  })

  const getFileSystemKey = computed(() => {
    return fileSystemKey.value
  })

  const getMemberManagerList = computed(() => {
    return userInfo.value?.memberManagerList
  })

  const getUserRole = computed(() => {
    return userInfo.value?.roleName
  })

  const getUserAuthorization = computed(() => {
    return {
      general: {},
      accountSettingPage: {
        menus: {
          entries: {
            visible: getUserMenus.value.get('AT')?.checked,
            readonly: getUserMenus.value.get('AT')?.visiable,
          },
          accountInformation: {
            visible: true,
            readonly: false,
          },
          securitySetting: {
            visible: true,
            readonly: false,
          },
          permissions: {
            visible: true,
            readonly: false,
          },
          serviceCharge: {
            visible: true,
            readonly: false,
          },
          storageUsage: {
            visible: true,
            readonly: false,
          },
          myMembershipSubscription: {
            visible: true,
            readonly: false,
          },
          membershipBenefits: {
            visible: true,
            readonly: false,
          },
          othersSetting: {
            visible: isMainAccount.value,
            readonly: false,
          },
        },
        functions: {},
      },
      fileSystemPage: {
        menus: {
          entries: {
            visible: getUserMenus.value.get('FS')?.checked,
            readonly: getUserMenus.value.get('FS')?.visiable,
          },
        },
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
      keyManagerPage: {
        menus: {
          entries: {
            visible: getFlatUserMenus.value.get('KM')?.checked,
            readonly: getFlatUserMenus.value.get('KM')?.visiable,
          },
        },
        functions: {},
      },
      cloudPCPage: {
        menus: {
          entries: {
            visible: getFlatUserMenus.value.get('CP')?.checked,
            readonly: getFlatUserMenus.value.get('CP')?.visiable,
          },
          dataDrive: {
            visible: getFlatUserMenus.value.get('CP_DATA_DRIVE_ACCESS')
              ?.checked,
            readonly: getFlatUserMenus.value.get('CP_DATA_DRIVE_ACCESS')
              ?.visiable,
          },
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
          cloudPC: {
            visible: getFlatUserMenus.value.get('CP')?.checked,
            readonly: getFlatUserMenus.value.get('CP')?.visiable,
          },
        },
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
      projectPage: {
        menus: {
          entries: {
            visible: getFlatUserMenus.value.get('PJ')?.checked,
            readonly: getFlatUserMenus.value.get('PJ')?.visiable,
          },
        },
        functions: {},
      },
      teamPage: {
        menus: {
          entries: {
            visible: getFlatUserMenus.value.get('TM')?.checked,
            readonly: getFlatUserMenus.value.get('TM')?.visiable,
          },
          teamSettings: {
            visible: getFlatUserMenus.value.get('TM_TEAM_SETTINGS')?.checked,
            readonly: getFlatUserMenus.value.get('TM_TEAM_SETTINGS')?.visiable,
          },
          teamFiles: {
            visible: getFlatUserMenus.value.get('TM_TEAM_FILES')?.checked,
            readonly: getFlatUserMenus.value.get('TM_TEAM_FILES')?.visiable,
          },
        },
        functions: {},
      },
      cloudAppPage: {
        menus: {
          entries: {
            visible: getFlatUserMenus.value.get('CA')?.checked,
            readonly: getFlatUserMenus.value.get('CA')?.visiable,
          },
          runApps: {
            visible: getFlatUserMenus.value.get('CA_RUN_APPS')?.checked,
            readonly: getFlatUserMenus.value.get('CA_RUN_APPS')?.visiable,
          },
          results: {
            visible: getFlatUserMenus.value.get('CA_GET_RESULTS')?.checked,
            readonly: getFlatUserMenus.value.get('CA_GET_RESULTS')?.visiable,
          },
        },
        functions: {},
      },
      memberUserPage: {
        menus: {
          entries: {
            visible: getFlatUserMenus.value.get('MU')?.checked,
            readonly: getFlatUserMenus.value.get('MU')?.visiable,
          },
          memberSettings: {
            visible: getFlatUserMenus.value.get('MU_MEMBER_SETTINGS')?.checked,
            readonly:
              getFlatUserMenus.value.get('MU_MEMBER_SETTINGS')?.visiable,
          },
          memberFiles: {
            visible: getFlatUserMenus.value.get('MU_MEMBER_FILES')?.checked,
            readonly: getFlatUserMenus.value.get('MU_MEMBER_FILES')?.visiable,
          },
        },
        functions: {},
      },
      paymentPage: {
        menus: {
          entries: {
            visible: getFlatUserMenus.value.get('PM')?.checked,
            readonly: getFlatUserMenus.value.get('PM')?.visiable,
          },
        },
        functions: {},
      },
      recycleBinPage: {
        menus: {
          entries: {
            visible: getFlatUserMenus.value.get('RB')?.checked,
            readonly: getFlatUserMenus.value.get('RB')?.visiable,
          },
        },
        functions: {},
      },
      accountSettings: {
        menus: {
          entries: {
            visible: getFlatUserMenus.value.get('AT')?.checked,
            readonly: getFlatUserMenus.value.get('AT')?.visiable,
          },
          accountSettingPage: {
            visible: getFlatUserMenus.value.get('AT_ACCOUNT_SETTINGS')?.checked,
            readonly: getFlatUserMenus.value.get('AT_ACCOUNT_SETTINGS')
              ?.visiable,
          },
        },
        functions: {
          allowEditBasicInformation: {
            visible: getFlatUserMenus.value.get('AC_SAVE_BASIC_INFORMATION')
              ?.checked,
            readonly: getFlatUserMenus.value.get('AC_SAVE_BASIC_INFORMATION')
              ?.visiable,
          },
        },
      },
    }
  })

  const getBucketName = computed(() => {
    return bucketName.value
  })

  const getMasterKeySalt = computed(() => {
    return userInfo.value.masterKeySalt
  })

  // actions

  function setAuthentication(payload: boolean) {
    authentication.value = payload
  }
  function setUserInfo(payload: UserInfo) {
    userInfo.value = payload
  }

  function setBucketName(payload: string) {
    bucketName.value = payload
  }

  function setRegion(payload: string) {
    region.value = payload
  }

  function setUserMenus(payload: UserMenu[]) {
    payload.forEach((element) => {
      userMenus.value.set(element.code, element)
    })
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

  function setMasterPassword(payload: string) {
    masterPassword.value = payload
  }

  function setFileSystemKey(payload: string) {
    fileSystemKey.value = payload
  }

  function setAuthenticationToken(payload: string) {
    setAtlasAuthTokenCookies('atlas-auth-token', payload)
  }

  function getAuthenticationToken() {
    return getAtlasAuthTokenCookies('atlas-auth-token')
  }

  function clearSession() {
    removeAtlasAuthTokenCookies('atlas-auth-token')
    localStorage.clear()
    sessionStorage.clear()
  }

  function saveLoggedinAuthData(payload: AuthState) {
    const { authentication, bucketName, region, userInfo, userMenus } = payload
    if (authentication) {
      setAuthentication(authentication)
    }
    if (userInfo) {
      setUserInfo(userInfo)
    }
    if (bucketName) {
      setBucketName(bucketName)
    }
    if (region) {
      setRegion(region)
    }
    if (userMenus) {
      setUserMenus(userMenus)
      setFlatUserMenus(userMenus)
    }
  }

  function reset() {
    authentication.value = false
    bucketName.value = ''
    region.value = ''
    userInfo.value = {}
    userMenus.value.clear()
  }

  function logout() {
    clearSession()
    reset()
  }

  return {
    region,
    userInfo,
    userMenus,
    bucketName,
    getUserRole,
    getUserName,
    getTrueName,
    getUserMenus,
    isMainAccount,
    getBucketName,
    flatUserMenus,
    authentication,
    isAuthenticated,
    getUserMenusArr,
    getFlatUserMenus,
    getMasterKeySalt,
    getFileSystemKey,
    getMasterPassword,
    getUserInformation,
    getUserAuthorization,
    getMemberManagerList,
    reset,
    logout,
    setRegion,
    setUserInfo,
    clearSession,
    setUserMenus,
    setBucketName,
    setFileSystemKey,
    setMasterPassword,
    setAuthentication,
    saveLoggedinAuthData,
    getAuthenticationToken,
    setAuthenticationToken,
  }
})
