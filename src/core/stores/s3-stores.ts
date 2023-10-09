import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { Credential } from 'src/core/types/credential-types'
import { UploadDataObject } from '../types/upload-object'
import { UploadStatus } from '../types/upload-status'
import { UploadFile } from '../types/upload-file'
import { UploadFolder } from '../types/upload-folder'

export const useS3Store = defineStore('s3-stores', () => {
  const credentials = reactive<Credential>({
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
    expiration: '',
    bucket: process.env.AWS_S3_STORAGE_BUCKET_NAME,
    region: process.env.AWS_REGION_CONFIG,
    writable: false,
  })

  const uploadObjects = ref<UploadDataObject[]>([])

  const form = reactive<{
    files?: Map<string | undefined, UploadFile>
    folders?: Map<string | undefined, UploadFolder>
  }>({
    files: new Map(),
    folders: new Map(),
  })

  //getter
  const getCredentials = computed(() => {
    return credentials
  })

  const getUploadObjects = computed(() => {
    return uploadObjects.value
  })

  const getUploadFolders = computed(() => {
    if (form.folders)
      return Array.from(form.folders.values()).sort((a, b) => {
        return (a?.level || 1) - (b?.level || 1)
      })
    return []
  })

  const getUploadFiles = computed(() => {
    if (form.files) return Array.from(form.files.values())
    return []
  })

  const getUploadFilesName = computed(() => {
    return getUploadFiles.value?.map((file) => {
      return { name: file?.file?.name }
    })
  })
  // actions

  function setCredentials(payload: Credential) {
    Object.assign(credentials, payload)
  }

  function setUploadObject(payload: UploadDataObject[]) {
    uploadObjects.value = payload
  }

  function setUploadFolders(payload: UploadFolder[]) {
    payload.forEach((element) => {
      form.folders?.set(element?.path, element)
    })
  }

  function setUploadFiles(payload: UploadFile[]) {
    payload.forEach((element) => {
      form.files?.set(
        element?.file?.webkitRelativePath || element?.file?.name,
        element
      )
    })
  }

  function updateUploadFolderParentId(item: UploadFolder, parentId: string) {
    form.folders?.set(item?.path, { ...item, parentId })
  }

  function updateUploadFileParentId(item: UploadFile, parentId: string) {
    form.files?.set(item?.file?.webkitRelativePath || item?.file?.name, {
      ...item,
      parentId: parentId,
    })
  }

  function getUploadFolderByKey(key: string | undefined) {
    return form.folders?.get(key)
  }

  function updateUploadProgress(item: File, progress: number) {
    const targetFile = form.files?.get(item?.webkitRelativePath || item?.name)
    if (targetFile)
      form.files?.set(item?.webkitRelativePath || item?.name, {
        ...targetFile,
        progress: progress,
      })
  }

  function updateUploadStatus(item: File, status: UploadStatus) {
    const targetFile = form.files?.get(item?.webkitRelativePath || item?.name)
    if (targetFile)
      form.files?.set(item?.webkitRelativePath || item?.name, {
        ...targetFile,
        status: status,
      })
  }

  function removeUploadFile(item: File) {
    form.files?.delete(item?.webkitRelativePath || item?.name)
  }

  function cancelUploadFile(item: File) {
    updateUploadStatus(item, 'CANCEL')
  }

  function clearAllUploadData() {
    form.files?.clear()
    form.folders?.clear()
  }

  return {
    form,
    getCredentials,
    getUploadObjects,
    getUploadFolders,
    getUploadFiles,
    getUploadFilesName,
    setCredentials,
    setUploadFiles,
    setUploadObject,
    cancelUploadFile,
    removeUploadFile,
    setUploadFolders,
    updateUploadStatus,
    clearAllUploadData,
    updateUploadProgress,
    getUploadFolderByKey,
    updateUploadFileParentId,
    updateUploadFolderParentId,
  }
})
