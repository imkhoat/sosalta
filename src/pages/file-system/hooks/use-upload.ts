import { ref } from 'vue'
import BMF from 'browser-md5-file'
import { storeToRefs } from 'pinia'
import { PART_SIZE } from 'src/core/utils'
import { errorHandler } from 'src/core/utils/error-handler'
import {
  httpsUploadFile,
  httpsGetS3FileKey,
  httpsCreateFolder,
  httpsDupplicateCheck,
  httpsUploadMemberFile,
  httpsGetSessionCredentials,
} from 'src/core/services/storage-services'
import {
  CreateFolderRequest,
  DupplicateCheckRequest,
  GetS3FileKeyRequest,
  GetSessionCredentialsRequest,
  UploadFileRequest,
} from 'src/core/types/services/storage-types'
import { useAWSS3 } from 'src/core/composables/use-s3'
import { useS3Store } from 'src/core/stores/s3-stores'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { CompletedPart, S3ClientConfig } from '@aws-sdk/client-s3'
import { httpsCheckAvailableBalance } from 'src/core/services/user-services'
import {
  HTTP_STATUS_CODE,
  RESPONSE_CODE,
} from 'src/core/services/utils/https-code'
import { PartData } from 'src/core/types/part-data-types'
import { UploadFolder } from 'src/core/types/upload-folder'
import { UploadFile } from 'src/core/types/upload-file'
import {
  ATLAS_FILE_SYSTEM,
  AtlasFileSystem,
  STORAGE_CLASS,
} from 'src/core/types/file-types'

export function useUpload() {
  const { getParent, getActiveUserName } = storeToRefs(useFileSystemStore())
  const { getCredentials, getUploadFolders, getUploadFiles } = storeToRefs(
    useS3Store()
  )

  const {
    setCredentials,
    updateUploadProgress,
    updateUploadStatus,
    updateUploadFolderParentId,
    updateUploadFileParentId,
    getUploadFolderByKey,
    clearAllUploadData,
  } = useS3Store()
  const {
    awsInitS3Client,
    awsCreateMultipartUpload,
    awsUploadPart,
    awsCompletedMultipartUpload,
    awsAbortMultipartUpload,
  } = useAWSS3()

  const loading = ref(false)

  async function _generatePartData(fileData: File) {
    const partQty = _caculatePartQty(fileData, PART_SIZE)
    const partArr = _chunkFile(fileData, PART_SIZE)

    const md5ArrPromise = partArr.map((element) => {
      return _generateHash(element)
    })

    const md5Arr = (await Promise.all(md5ArrPromise)) as string[]

    return {
      partQty,
      partArr,
      md5Arr,
    }
  }

  function _generateHash(blob: Blob) {
    const bmfMD5 = new BMF()
    return new Promise((resolve) => {
      bmfMD5.md5(blob, (err: Error, md5: string) => {
        resolve(md5)
      })
    })
  }

  function _chunkFile(fileData: File, partSize: number) {
    let startPoint = 0
    const endPoint = fileData.size
    const chunks = []
    while (startPoint < endPoint) {
      const newStartPoint = startPoint + partSize
      chunks.push(fileData.slice(startPoint, newStartPoint))
      startPoint = newStartPoint
    }
    return chunks
  }

  function _caculatePartQty(fileData: File, partSize: number) {
    const partQty = fileData.size / partSize
    return partQty * partSize < fileData.size ? partQty + 1 : partQty
  }

  async function _initAwsS3Client() {
    const params: S3ClientConfig = {
      region: getCredentials.value?.region,
      credentials: {
        accessKeyId: getCredentials.value?.accessKeyId || '',
        secretAccessKey: getCredentials.value?.secretAccessKey || '',
        sessionToken: getCredentials.value?.sessionToken || '',
        expiration: new Date(getCredentials.value?.expiration) || '',
      },
    }
    await awsInitS3Client(params)
  }

  async function _handleAwsCreateMutiplepartUpload(
    bucket: string | undefined,
    userName: string | undefined,
    key: string | undefined
  ) {
    try {
      if (bucket && userName && key) {
        const response = await awsCreateMultipartUpload(bucket, key, userName)

        if (response.Bucket && response.UploadId) {
          return response.UploadId
        }
        return ''
      }
      return ''
    } catch (error) {
      throw error
    }
  }

  async function _handleAwsAbortMutiplepartUpload(
    bucket: string | undefined,
    key: string | undefined,
    uploadId: string | undefined
  ) {
    try {
      if (bucket && key && uploadId) {
        const response = await awsAbortMultipartUpload(bucket, key, uploadId)
        if (
          response.$metadata?.httpStatusCode === HTTP_STATUS_CODE.SUCCESS ||
          response.$metadata?.httpStatusCode ===
            HTTP_STATUS_CODE.SUCCESS_WITH_NO_CONTENT
        ) {
          return true
        }
        return false
      }
      return false
    } catch (error) {
      throw error
    }
  }

  async function _handleAwsCompletedMutiplepartUpload(
    bucket: string | undefined,
    key: string | undefined,
    part: CompletedPart[],
    uploadId: string | undefined
  ) {
    try {
      if (bucket && key && uploadId) {
        const response = await awsCompletedMultipartUpload(
          bucket,
          key,
          part,
          uploadId
        )
        if (
          response.$metadata?.httpStatusCode === HTTP_STATUS_CODE.SUCCESS ||
          response.$metadata?.httpStatusCode ===
            HTTP_STATUS_CODE.SUCCESS_WITH_NO_CONTENT
        ) {
          return true
        }
        return false
      }
      return false
    } catch (error) {
      throw error
    }
  }

  async function _handleAwsUploadPart(
    bucket: string | undefined,
    s3FileKey: string | undefined,
    part: number | undefined,
    uploadId: string | undefined,
    fileContent: string | Blob | undefined
  ) {
    try {
      if (bucket && s3FileKey && uploadId && part) {
        const response = await awsUploadPart(
          bucket,
          s3FileKey,
          part,
          uploadId,
          fileContent
        )
        if (
          response.$metadata?.httpStatusCode === HTTP_STATUS_CODE.SUCCESS ||
          response.$metadata?.httpStatusCode ===
            HTTP_STATUS_CODE.SUCCESS_WITH_NO_CONTENT
        ) {
          return response?.ETag
        }
        return false
      }
      return false
    } catch (error) {
      throw error
    }
  }

  async function _handleSaveFileToDatabase(
    bucketName: string | undefined,
    parentId: string,
    s3FileKey: string | undefined,
    file: File,
    partData: PartData,
    isMemberFile: boolean
  ) {
    try {
      const params: UploadFileRequest = {
        item: {
          bucketName: bucketName || '',
          fileType: file.type,
          lastModified: file.lastModified.toString(),
          md5Arr: partData?.md5Arr,
          name: file.name,
          parentId,
          partNumber: partData.partQty,
          pseudoLastModifed: `A${file.lastModified.toString()}`,
          s3FileKey: s3FileKey || '',
          size: file.size,
          storageClass: STORAGE_CLASS.STANDARD,
        },
      }
      if (isMemberFile) {
        return await httpsUploadMemberFile(params)
      } else {
        return await httpsUploadFile(params)
      }
    } catch (error) {}
  }

  async function _getS3FileKey(fileName: string, parentId: string) {
    try {
      const params: GetS3FileKeyRequest = {
        item: {
          name: fileName,
          parentId,
        },
      }
      const data = await httpsGetS3FileKey(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data
      }
      return ''
    } catch (error) {}
  }

  async function _handleUploadSingleFile(
    file: File,
    parentId: string,
    isMemberFile: boolean
  ) {
    let bucketId, s3FileKey, uploadId

    try {
      loading.value = true
      const uploadedPartArr = []
      const userName = getActiveUserName.value
      bucketId = getCredentials.value?.bucket
      updateUploadProgress(file, 10)
      const partData = await _generatePartData(file)
      updateUploadProgress(file, 20)
      s3FileKey = await _getS3FileKey(file.name, parentId)

      updateUploadProgress(file, 30)
      await _initAwsS3Client()

      updateUploadProgress(file, 40)
      uploadId = await _handleAwsCreateMutiplepartUpload(
        bucketId,
        userName,
        s3FileKey
      )

      updateUploadProgress(file, 50)
      for (let index = 0; index < partData.partQty; index++) {
        const part = partData.partArr[index]
        const eTag = await _handleAwsUploadPart(
          bucketId,
          s3FileKey,
          index + 1,
          uploadId,
          part
        )
        if (eTag) {
          uploadedPartArr.push({ ETag: eTag, PartNumber: index + 1 })
        }
      }

      updateUploadProgress(file, 80)
      await _handleAwsCompletedMutiplepartUpload(
        bucketId,
        s3FileKey,
        uploadedPartArr,
        uploadId
      )
      updateUploadProgress(file, 90)
      await _handleSaveFileToDatabase(
        bucketId,
        parentId,
        s3FileKey,
        file,
        partData,
        isMemberFile
      )

      updateUploadProgress(file, 100)
      updateUploadStatus(file, 'UPLOADED')
    } catch (error) {
      await _handleAwsAbortMutiplepartUpload(bucketId, s3FileKey, uploadId)
      updateUploadStatus(file, 'ERROR')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function _handleCreateFolder(
    folderName: string | undefined,
    parentId: string | undefined
  ) {
    try {
      if (!folderName) {
        throw new Error('Folder name required')
      } else if (!parentId) {
        throw new Error('No parent found')
      }
      loading.value = true
      const params: CreateFolderRequest = {
        item: {
          fileType: 'folder',
          storageClass: STORAGE_CLASS.STANDARD,
          bucketName: getCredentials.value?.bucket || '',
          name: folderName,
          parentId: parentId,
        },
      }

      const data = await httpsCreateFolder(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data
      }
      return false
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function _handleUploadFiles(
    files: UploadFile[],
    isMemberFile: boolean
  ) {
    try {
      if (files) {
        for (let index = 0; index < files.length; index++) {
          const { file, parentId, status } = files[index]
          if (file && status === 'OPEN') {
            await _handleUploadSingleFile(file, parentId, isMemberFile)
          }
        }
      }
    } catch (error) {
      throw error
    }
  }

  async function _handleUploadFolder(
    folders: UploadFolder[],
    files: UploadFile[]
  ) {
    await _handleCreateFolders(folders, files)
  }

  async function _handleCreateFolders(
    folder: UploadFolder[],
    files: UploadFile[]
  ) {
    try {
      if (!folder || folder?.length <= 0) {
        errorHandler.notify('You need pickup at least 1 folder')
        return
      }
      for (let index = 0; index < folder.length; index++) {
        const element = folder[index]
        const uploadTarget = getUploadFolderByKey(element.path)
        const response = await _handleCreateFolder(
          uploadTarget?.name,
          uploadTarget?.parentId
        )
        if (response) {
          element.id = response
          _updateFolderParentId(folder, response, element?.path)
          _updateFileParentId(files, response, element?.path)
        }
      }
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    }
  }

  function _updateFolderParentId(
    folders: UploadFolder[],
    parentId: string | undefined,
    parentPath: string | undefined
  ) {
    if (!folders || !parentId || !parentPath) {
      return
    }
    folders
      .filter((item) => {
        return item.parentPath === parentPath
      })
      .forEach((item) => {
        updateUploadFolderParentId(item, parentId)
      })
  }

  function _updateFileParentId(
    files: UploadFile[],
    parentId: string | undefined,
    parentPath: string | undefined
  ) {
    if (!files || !parentId || !parentPath) {
      return
    }
    files
      .filter((file) => {
        const lastIndexOfSlash =
          file?.file?.webkitRelativePath?.lastIndexOf('/')
        const path = file?.file?.webkitRelativePath.substring(
          0,
          lastIndexOfSlash
        )
        return path === parentPath
      })
      .forEach((item) => {
        updateUploadFileParentId(item, parentId)
      })
  }

  async function handleGetSessionCredentials(
    type: AtlasFileSystem = ATLAS_FILE_SYSTEM.DEFAULT_FILE_SYSTEM
  ) {
    try {
      const queryParams: GetSessionCredentialsRequest = {
        prefix: getActiveUserName.value || '',
        type,
      }

      const data = await httpsGetSessionCredentials(queryParams)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        setCredentials(data?.data)
      }
    } catch (error) {}
  }

  async function handleHasAvailableBalance() {
    try {
      const data = await httpsCheckAvailableBalance()

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return true
      }
    } catch (error) {
      return false
    }
  }

  async function handleHasDupplicateCheck(fileNames: { name: string }[]) {
    try {
      const params: DupplicateCheckRequest = {
        destinationParentId: getParent.value?.id || '',
        items: fileNames,
      }

      const data = await httpsDupplicateCheck(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  async function handleStartUpload(
    uploadType: 'UPLOAD_FILE_MODAL' | 'UPLOAD_FOLDER_MODAL',
    isMemberFile: boolean
  ) {
    try {
      if (uploadType === 'UPLOAD_FILE_MODAL') {
        await _handleUploadFiles(getUploadFiles.value, isMemberFile)
      } else {
        await _handleUploadFolder(getUploadFolders.value, getUploadFiles.value)
        await _handleUploadFiles(getUploadFiles.value, isMemberFile)
      }
      handleClearUploadProcess()
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    }
  }

  async function handleClearUploadProcess() {
    clearAllUploadData()
  }

  return {
    loading,
    _generatePartData,
    _getS3FileKey,
    _initAwsS3Client,
    _handleAwsCreateMutiplepartUpload,
    _handleAwsUploadPart,
    _handleAwsCompletedMutiplepartUpload,
    _handleSaveFileToDatabase,
    _handleAwsAbortMutiplepartUpload,
    handleStartUpload,
    handleHasDupplicateCheck,
    handleHasAvailableBalance,
    handleClearUploadProcess,
    handleGetSessionCredentials,
  }
}
