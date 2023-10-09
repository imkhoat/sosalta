import { useAuthStore } from './auth'
import { ref, reactive, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { Pagging } from 'src/core/types/pagging-types'
import { RootDirType } from 'src/core/types/root-dir-types'
import { StorageFile, DIR_TYPE } from 'src/core/types/file-types'
import { useStorage } from '@vueuse/core'
import { UserInfo } from '../types/user-info'
import { usePaginationStore } from './pagination'
import { useSearchStore } from './search'

export const useFileSystemStore = defineStore('file-system', () => {
  // state
  const { pagination } = storeToRefs(usePaginationStore())
  const { searchKeyword } = storeToRefs(useSearchStore())
  const { getUserName } = storeToRefs(useAuthStore())
  const { resetSearchKeyword } = useSearchStore()
  const { resetPagination, updatePagination } = usePaginationStore()

  //reset state
  resetPagination()
  resetSearchKeyword()

  //data
  const loading = reactive({
    table: false,
  })
  const files = ref<StorageFile[]>([])
  const selectedObjects = ref<StorageFile[]>([])
  const activeObject = useStorage(
    'file-system-activeObject',
    {} as StorageFile,
    sessionStorage
  )
  const activeUser = useStorage(
    'file-system-userInfo',
    {} as Partial<UserInfo>,
    sessionStorage
  )

  const filesPagging = reactive<Pagging>({
    currPage: 0,
    totalPage: 0,
    pageSize: 30,
    totalCount: 0,
  })
  const parent = useStorage(
    'file-system-parent',
    {
      id: getUserName.value || '',
      name: getUserName.value,
      rootDirType: undefined,
    },
    sessionStorage
  )
  const isProtected = ref(false)
  const rootDirType = ref<RootDirType>()

  // getter

  const getActiveUserName = computed(() => {
    return activeUser.value.userName
  })

  const getActiveUserInformation = computed(() => {
    return activeUser.value
  })

  const getRootDirType = computed(() => {
    return rootDirType.value
  })

  const getRootFolderId = computed(() => {
    return `${getActiveUserName.value}`
  })

  const getEncryptedFolderId = computed(() => {
    return `${getActiveUserName.value}/encrypted`
  })

  const getShareFolderId = computed(() => {
    return `${getActiveUserName.value}/share`
  })

  const getAnalysisFolderId = computed(() => {
    return `${getActiveUserName.value}/analysis`
  })

  const getUploadfileFolderId = computed(() => {
    return `${getActiveUserName.value}/uploadfile`
  })

  const getTrashId = computed(() => {
    return `${getActiveUserName.value}/trash`
  })

  const getDefaultRootFolder = computed(() => {
    const object = new Map<string, RootDirType>()
    object.set(getRootFolderId.value, {
      id: getRootFolderId.value,
      type: DIR_TYPE.STORAGE,
    })
    object.set(getShareFolderId.value, {
      id: getShareFolderId.value,
      type: DIR_TYPE.STORAGE,
    })
    object.set(getEncryptedFolderId.value, {
      id: getEncryptedFolderId.value,
      type: DIR_TYPE.ENCRYPT,
    })
    object.set(getAnalysisFolderId.value, {
      id: getAnalysisFolderId.value,
      type: DIR_TYPE.STORAGE,
    })
    object.set(getUploadfileFolderId.value, {
      id: getUploadfileFolderId.value,
      type: DIR_TYPE.STORAGE,
    })
    object.set(getTrashId.value, {
      id: getTrashId.value,
      type: DIR_TYPE.TRASH,
    })
    return object
  })

  const getLoadingState = computed(() => {
    return loading
  })
  const getFiles = computed(() => {
    return files.value
  })

  const getSelectedObjects = computed(() => {
    return selectedObjects.value
  })

  const getActiveObject = computed(() => {
    return activeObject.value
  })

  const getParent = computed(() => {
    return parent.value
  })

  const getParentId = computed(() => {
    return parent.value?.id
  })

  const getParentStorageClass = computed(() => {
    return parent.value?.storageClass
  })

  const getProtectedState = computed(() => {
    return isProtected.value
  })

  // actions

  function setActiveUserInfo(payload: UserInfo | Partial<UserInfo>) {
    activeUser.value = payload
  }

  function setFiles(payload: StorageFile[]) {
    files.value = payload
  }

  function setActiveObject(payload: StorageFile) {
    activeObject.value = payload
  }

  function setRootDirType(payload: RootDirType) {
    rootDirType.value = payload
  }

  function setParent(payload: StorageFile) {
    parent.value = payload
  }

  function setParentId(payload: string) {
    parent.value.id = payload
  }

  function toggleLoading(key: keyof typeof loading) {
    loading[key] = !loading[key]
  }

  function turnProtectedOn() {
    isProtected.value = true
  }

  function turnProtectedOff() {
    isProtected.value = false
  }

  function resetParent() {
    parent.value = {
      id: getActiveUserName.value || '',
      name: getActiveUserName.value,
      rootDirType: undefined,
    }
  }

  return {
    files,
    getFiles,
    getParent,
    pagination,
    getTrashId,
    getParentId,
    filesPagging,
    searchKeyword,
    getRootDirType,
    getRootFolderId,
    getLoadingState,
    selectedObjects,
    getActiveObject,
    getProtectedState,
    getActiveUserName,
    getSelectedObjects,
    getEncryptedFolderId,
    getDefaultRootFolder,
    getParentStorageClass,
    getActiveUserInformation,
    setFiles,
    setParent,
    setParentId,
    resetParent,
    toggleLoading,
    setRootDirType,
    setActiveObject,
    updatePagination,
    turnProtectedOn,
    turnProtectedOff,
    setActiveUserInfo,
  }
})
