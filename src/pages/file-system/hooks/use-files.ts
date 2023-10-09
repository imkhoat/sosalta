import { ref } from 'vue'
import { format } from 'date-fns'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import {
  httpsGetFileList,
  httpsRenameObject,
  httpsDeleteObjects,
  httpsCreateFolder,
  httpsGetFileUrl,
  httpsDownloadFile,
  httpsDownloadFiles,
  httpsCopyObjects,
  httpsMoveObjects,
  httpsDecryptObject,
  httpsFileUnzip,
  httpsDownloadBlobData,
  httpsEncryptObjects,
  httpsImportFiles,
  httpsCreateNewFile,
  httpsGetDecryptFileList,
  httpsGetFileSystemHash,
  httpsSearchFileList,
  httpsChangeToFrequentStatus,
  httpsChangeToArchiveStatus,
  httpsChangeToInfrequentStatus,
  httpsRecycleBinDelete,
  httpsRecycleBinEmptyTrash,
  httpsUpdateFile,
} from 'src/core/services/storage-services'
import {
  GetFileListRequest,
  DeleteObjectsRequest,
  RenameObjectRequest,
  CreateFolderRequest,
  GetFileUrlRequest,
  DownloadFilesRequest,
  CopyObjectsRequest,
  MoveObjectsRequest,
  DecryptObjectRequest,
  FileUnzipRequest,
  EncryptObjectsRequest,
  ImportFilesRequest,
  CreateNewFileRequest,
  NewFileType,
  GetDecryptFileListRequest,
  SearchFileListRequest,
  UpdateFileRequest,
} from 'src/core/types/services/storage-types'
import { useFileSystemStore } from 'src/core/stores/file-system'
import {
  HTTP_STATUS_CODE,
  RESPONSE_CODE,
} from 'src/core/services/utils/https-code'
import { httpsShareObject } from 'src/core/services/user-services'
import { ShareObjectRequest } from 'src/core/types/services/user-types'
import { TablePagination } from 'src/core/types/pagging-types'
import { useAWSS3 } from 'src/core/composables/use-s3'
import { useS3Store } from 'src/core/stores/s3-stores'
import { S3ClientConfig } from '@aws-sdk/client-s3'
import {
  STORAGE_CLASS,
  StorageClass,
  StorageFileType,
} from 'src/core/types/file-types'

export function useFiles() {
  // local data
  const loading = ref(false)

  // composables
  const $q = useQuasar()
  const { t } = useI18n()
  const { getBucketName, getTrueName, getMasterPassword, getFileSystemKey } =
    storeToRefs(useAuthStore())
  const { setFileSystemKey, setMasterPassword } = useAuthStore()
  const { getCredentials } = storeToRefs(useS3Store())
  const {
    getParent,
    pagination,
    getParentId,
    getTrashId,
    getRootFolderId,
    getActiveObject,
    getActiveUserName,
    getSelectedObjects,
    getEncryptedFolderId,
    getDefaultRootFolder,
    getParentStorageClass,
  } = storeToRefs(useFileSystemStore())
  const { setFiles, turnProtectedOn, turnProtectedOff, updatePagination } =
    useFileSystemStore()
  const { awsGetObject, awsInitS3Client } = useAWSS3()

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

  async function handleFetchFileList(
    parentId?: string,
    currentPaging?: TablePagination | Partial<TablePagination>
  ) {
    try {
      const params: GetFileListRequest = {
        bucketName: getBucketName.value,
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        lastEvaluatedFile: currentPaging?.page ?? pagination.value?.page,
        parentId:
          parentId || getParentId.value || getActiveUserName.value || '',
      }
      const data = await httpsGetFileList(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        if (data?.data?.lastEvaluatedFile) {
          const page =
            data?.data?.lastEvaluatedFile > 0
              ? data?.data?.lastEvaluatedFile - 1
              : 0
          updatePagination({
            rowsPerPage: currentPaging?.rowsPerPage,
            page: page,
            rowsNumber: data?.data?.total,
          })
        } else {
          updatePagination({
            rowsPerPage: currentPaging?.rowsPerPage,
            page: data?.data?.pages,
            rowsNumber: data?.data?.total,
          })
        }
        setFiles(
          data.data?.items.map((item) => {
            return {
              ...item,
              gmtCreateString: item.gmtCreate
                ? format(new Date(item.gmtCreate), 'MMM dd, yyyy').toString()
                : '',
              gmtUpdateString: item.gmtUpdate
                ? format(new Date(item.gmtUpdate), 'MMM dd, yyyy').toString()
                : '',
              rootDirType:
                getDefaultRootFolder.value.get(item.id) ??
                getDefaultRootFolder.value.get(getRootFolderId.value),
            }
          })
        )
      }
    } catch (error) {
      throw error
    }
  }

  async function handleSearchFileList(
    parentId?: string,
    currentPaging?: TablePagination | Partial<TablePagination>,
    keyword?: string
  ) {
    try {
      const params: SearchFileListRequest = {
        searchName: keyword,
        bucketName: getBucketName.value,
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        pageCount: currentPaging?.page ?? pagination.value?.page,
        parentId:
          parentId || getParentId.value || getActiveUserName.value || '',
        userName: getActiveUserName.value,
        deleted: 0,
      }
      const data = await httpsSearchFileList(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        if (data?.data?.lastEvaluatedFile) {
          const page =
            data?.data?.lastEvaluatedFile > 0
              ? data?.data?.lastEvaluatedFile - 1
              : 0
          updatePagination({
            rowsPerPage: currentPaging?.rowsPerPage,
            page: page,
            rowsNumber: data?.data?.total,
          })
        } else {
          updatePagination({
            rowsPerPage: currentPaging?.rowsPerPage,
            page: data?.data?.pages,
            rowsNumber: data?.data?.total,
          })
        }
        setFiles(
          data.data?.items.map((item) => {
            return {
              ...item,
              gmtCreateString: item.gmtCreate
                ? format(new Date(item.gmtCreate), 'MMM dd, yyyy').toString()
                : '',
              gmtUpdateString: item.gmtUpdate
                ? format(new Date(item.gmtUpdate), 'MMM dd, yyyy').toString()
                : '',
              rootDirType:
                getDefaultRootFolder.value.get(item.id) ??
                getDefaultRootFolder.value.get(getRootFolderId.value),
            }
          })
        )
      }
    } catch (error) {
      throw error
    }
  }

  async function fetchEncryptedFileList(
    parentId?: string,
    masterPassword?: string,
    currentPaging?: TablePagination | Partial<TablePagination>
  ) {
    try {
      const params: GetDecryptFileListRequest = {
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        parentId: parentId || getParentId.value || '',
        masterPassword: masterPassword || getMasterPassword.value || '',
        page: currentPaging?.page ?? pagination.value?.page,
        fileSystemKey: getFileSystemKey.value || '',
      }
      loading.value = true
      const data = await httpsGetDecryptFileList(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        if (data?.data?.lastEvaluatedFile) {
          const page =
            data?.data?.lastEvaluatedFile > 0
              ? data?.data?.lastEvaluatedFile - 1
              : 0
          updatePagination({
            rowsPerPage: currentPaging?.rowsPerPage,
            page: page,
            rowsNumber: data?.data?.total,
          })
        } else {
          updatePagination({
            rowsPerPage: currentPaging?.rowsPerPage,
            page: data?.data?.pages,
            rowsNumber: data?.data?.total,
          })
        }
        setFiles(
          data.data?.items.map((item) => {
            return {
              ...item,
              gmtCreateString: format(
                new Date(item.gmtCreate || ''),
                'MMM dd, yyyy'
              ).toString(),
              gmtUpdateString: format(
                new Date(item.gmtUpdate || ''),
                'MMM dd, yyyy'
              ).toString(),
              rootDirType:
                getDefaultRootFolder.value.get(item.id) ??
                getDefaultRootFolder.value.get(getEncryptedFolderId.value),
            }
          })
        )

        setFileSystemKey(data?.data?.fileSystemKey)
        turnProtectedOff()
      }
    } catch (error) {
      turnProtectedOn()
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleDeleteFiles() {
    try {
      const deleteFiles = getSelectedObjects.value.map((item) => {
        return {
          id: item.id,
          name: item.name,
        }
      })

      loading.value = true

      const params: DeleteObjectsRequest = {
        bucketName: getBucketName.value,
        items: deleteFiles,
        projectTeamId: '',
      }

      const data = await httpsDeleteObjects(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Delete success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleDeleteActiveFile() {
    try {
      const deleteFiles = {
        id: getActiveObject.value?.id || '',
        name: getActiveObject.value?.name || '',
      }

      loading.value = true

      const params: DeleteObjectsRequest = {
        bucketName: getBucketName.value,
        items: [deleteFiles],
        projectTeamId: '',
      }

      const data = await httpsDeleteObjects(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Delete success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleRenameObject(destinationName: string) {
    if (!destinationName) {
      throw new Error('Name required')
    }
    try {
      const params: RenameObjectRequest = {
        destinationName,
        item: {
          id: getActiveObject.value?.id || '',
        },
        projectTeamId: '',
      }
      loading.value = true
      const data = await httpsRenameObject(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Rename success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleShareObject(receivers: string[]) {
    try {
      if (!receivers || receivers.length <= 0) {
        throw new Error('Please select receivers')
      }
      loading.value = true
      const files = getSelectedObjects.value.map((item) => {
        return {
          fileId: item.id,
          fileName: item.name,
          fileSize: item.size,
          registerContent: '',
        }
      })
      const params: ShareObjectRequest = {
        type: 'share',
        contents: files,
        receivers,
        sender: {
          userName: getActiveUserName.value || '',
          trueName: JSON.stringify(getTrueName.value),
        },
      }

      const data = await httpsShareObject(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Share success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleShareActiveObject(receivers: string[]) {
    try {
      if (!receivers || receivers.length <= 0) {
        throw new Error('Please select receivers')
      }
      loading.value = true
      const file = {
        fileId: getActiveObject.value?.id || '',
        fileName: getActiveObject.value?.name || '',
        fileSize: getActiveObject.value?.size || '',
        registerContent: '',
      }
      const params: ShareObjectRequest = {
        type: 'share',
        contents: [file],
        receivers,
        sender: {
          userName: getActiveUserName.value || '',
          trueName: JSON.stringify(getTrueName.value),
        },
      }

      const data = await httpsShareObject(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Share success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleCreateFolder(folderName: string) {
    try {
      if (!folderName) {
        throw new Error('Folder name required')
      }
      loading.value = true
      const params: CreateFolderRequest = {
        item: {
          fileType: 'folder',
          storageClass: getParentStorageClass.value || STORAGE_CLASS.STANDARD,
          bucketName: getBucketName.value,
          name: folderName,
          parentId: getParentId.value || '',
        },
      }

      const data = await httpsCreateFolder(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Create new folder success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleDownloadActiveFile() {
    try {
      if (!getActiveObject.value?.id) {
        throw new Error('File error or not exist')
      }
      loading.value = true
      const params: GetFileUrlRequest = {
        item: {
          id: getActiveObject.value?.id,
        },
      }

      const data = await httpsGetFileUrl(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        httpsDownloadFile(
          data?.data,
          getActiveObject.value?.name,
          getActiveObject.value?.fileType
        )
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleGetActiveFileUrl() {
    try {
      if (!getActiveObject.value?.id) {
        throw new Error('File error or not exist')
      }
      loading.value = true
      const params: GetFileUrlRequest = {
        item: {
          id: getActiveObject.value?.id,
        },
      }

      const data = await httpsGetFileUrl(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data
      }
      return null
    } catch (error) {
      return null
    } finally {
      loading.value = false
    }
  }

  async function handleDownloadFiles() {
    try {
      if (getSelectedObjects.value?.length <= 0) {
        throw new Error('Please select files')
      }
      loading.value = true
      const params: DownloadFilesRequest = {
        items: getSelectedObjects.value.map((item) => {
          return item?.id || ''
        }),
      }
      const data = await httpsDownloadFiles(params)
      httpsDownloadBlobData(data as unknown as BlobPart) // remove after the format fixed
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleDownloadSingleFile() {
    try {
      loading.value = true
      const file = getSelectedObjects.value[0]
      const params: GetFileUrlRequest = {
        item: {
          id: file?.id || '',
        },
      }

      const data = await httpsGetFileUrl(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        httpsDownloadFile(data?.data, file?.name, file?.fileType)
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleCopyActiveObject(destinationParentId: string) {
    try {
      if (!getActiveObject.value?.id) {
        throw new Error('Please select files')
      }
      loading.value = true
      const params: CopyObjectsRequest = {
        bucketName: getBucketName.value,
        destinationParentId,
        items: [
          {
            id: getActiveObject.value?.id,
            name: getActiveObject.value?.name || '',
          },
        ],
        operate: 'copy',
      }
      const data = await httpsCopyObjects(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Copy success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleCopyObjects(destinationParentId: string) {
    try {
      if (getSelectedObjects.value?.length <= 0) {
        throw new Error('Please select files')
      }
      loading.value = true
      const items = getSelectedObjects.value.map((item) => {
        return {
          id: item?.id || '',
          name: item?.name || '',
        }
      })
      const params: CopyObjectsRequest = {
        bucketName: getBucketName.value,
        destinationParentId,
        items,
        operate: 'copy',
      }
      const data = await httpsCopyObjects(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Copy success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleMoveActiveObject(destinationParentId: string) {
    try {
      if (!getActiveObject.value?.id) {
        throw new Error('Please select files')
      }
      loading.value = true
      const params: MoveObjectsRequest = {
        bucketName: getBucketName.value,
        destinationParentId,
        items: [
          {
            id: getActiveObject.value?.id,
            name: getActiveObject.value?.name || '',
          },
        ],
        operate: 'move',
      }
      const data = await httpsMoveObjects(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Move success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleMoveObjects(destinationParentId: string) {
    try {
      if (getSelectedObjects.value?.length <= 0) {
        throw new Error('Please select files')
      }
      loading.value = true
      const items = getSelectedObjects.value.map((item) => {
        return {
          id: item?.id || '',
          name: item?.name || '',
        }
      })
      const params: MoveObjectsRequest = {
        bucketName: getBucketName.value,
        destinationParentId,
        items,
        operate: 'move',
      }
      const data = await httpsMoveObjects(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Move success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleDecryptObject(
    destinationParentId: string,
    masterPassword: string
  ) {
    try {
      if (!getActiveObject.value?.id) {
        throw new Error('Please select files')
      }
      loading.value = true
      const params: DecryptObjectRequest = {
        parentId: destinationParentId,
        masterPassword,
        items: [
          {
            id: getActiveObject.value?.id,
            name: getActiveObject.value?.name || '',
            size: getActiveObject.value?.size || 0,
          },
        ],
      }
      const data = await httpsDecryptObject(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Decrypt success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleEncryptObjects(
    masterPassword: string,
    keyIndex: number
  ) {
    try {
      if (!getActiveObject.value?.id) {
        throw new Error('Please select files')
      }
      loading.value = true
      const params: EncryptObjectsRequest = {
        parentId: `${getActiveUserName.value}/encrypted`,
        masterPassword,
        index: keyIndex,
        items: [
          {
            id: getActiveObject.value?.id,
            name: getActiveObject.value?.name || '',
            size: getActiveObject.value?.size || 0,
          },
        ],
      }
      const data = await httpsEncryptObjects(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Encrypt success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleDecompressObject(
    destinationParentId: string,
    destinationPath: string
  ) {
    try {
      if (!getActiveObject.value?.id) {
        throw new Error('File not exist')
      }
      loading.value = true
      const params: FileUnzipRequest = {
        fileId: getActiveObject.value?.id || '',
        parentId: destinationParentId,
      }

      const data = await httpsFileUnzip(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: `Online Decompression Request Submitted for ${getActiveObject.value?.name}. It will appear in the ${destinationPath} soon.`,
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleImportFiles(params: ImportFilesRequest) {
    try {
      loading.value = true
      const data = await httpsImportFiles(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: `Importing files, you can monitor the import progress in the <a class="text-white" href="/import-progress">import page</a>`,
          type: 'positive',
          html: true,
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleCreateNewFile({
    fileName,
    fileString,
    fileType,
  }: {
    fileName: string
    fileString: string
    fileType: NewFileType
  }) {
    try {
      loading.value = true
      const params: CreateNewFileRequest = {
        fileName,
        fileString,
        fileType,
        bucketName: getBucketName.value,
        parentId: getParent.value?.id || '',
      }
      const data = await httpsCreateNewFile(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'File created success',
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleUpdateFile({
    fileId,
    fileString,
    fileType,
  }: {
    fileId: string
    fileString: string
    fileType: StorageFileType
  }) {
    try {
      loading.value = true
      const params: UpdateFileRequest = {
        fileId,
        fileString,
        fileType,
      }
      const data = await httpsUpdateFile(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'File update success',
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleValidateEncryptedPassword(password: string) {
    try {
      loading.value = true
      const data = await httpsGetFileSystemHash({ masterPassword: password })

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        setMasterPassword(password)
        setFileSystemKey(data?.data)
        return true
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleAwsGetFileDetail(key: string | undefined) {
    try {
      _initAwsS3Client()
      const bucketId = getCredentials.value?.bucket
      if (bucketId && key) {
        const response = await awsGetObject(bucketId, key)
        if (
          response.$metadata?.httpStatusCode === HTTP_STATUS_CODE.SUCCESS ||
          response.$metadata?.httpStatusCode ===
            HTTP_STATUS_CODE.SUCCESS_WITH_NO_CONTENT
        ) {
          return response
        }
        return null
      }
      return null
    } catch (error) {
      throw error
    }
  }

  async function handleChangeStorageType(storageClass: StorageClass) {
    try {
      loading.value = true
      let data = null
      if (storageClass === STORAGE_CLASS.GLACIER) {
        data = await httpsChangeToArchiveStatus(getActiveObject.value?.id)
      } else if (storageClass === STORAGE_CLASS.STANDARD) {
        data = await httpsChangeToFrequentStatus(getActiveObject.value?.id)
      } else {
        data = await httpsChangeToInfrequentStatus(getActiveObject.value?.id)
      }

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'File change status success',
          type: 'positive',
        })
        return true
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleRecycleBinDeleteActiveFile() {
    try {
      const deleteFiles = {
        id: getActiveObject.value?.id || '',
        name: getActiveObject.value?.name || '',
      }

      loading.value = true

      const params = {
        bucketName: getBucketName.value,
        items: [deleteFiles],
      }

      const data = await httpsRecycleBinDelete(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Delete success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleRecycleBinDeleteFiles() {
    try {
      const deleteFiles = getSelectedObjects.value.map((item) => {
        return {
          id: item.id,
          name: item.name,
        }
      })

      loading.value = true

      const params = {
        bucketName: getBucketName.value,
        items: deleteFiles,
      }

      const data = await httpsRecycleBinDelete(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Delete success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleRecycleBinEmptyTrash() {
    try {
      loading.value = true

      const params = {
        bucketName: getBucketName.value,
        parentId: getTrashId.value,
      }

      const data = await httpsRecycleBinEmptyTrash(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('Empty trash success!'),
          type: 'positive',
        })
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    pagination,
    getSelectedObjects,
    handleUpdateFile,
    handleImportFiles,
    handleShareObject,
    handleCopyObjects,
    handleDeleteFiles,
    handleMoveObjects,
    handleCreateFolder,
    handleRenameObject,
    handleFetchFileList,
    handleCreateNewFile,
    handleDecryptObject,
    handleDownloadFiles,
    handleEncryptObjects,
    handleSearchFileList,
    handleGetActiveFileUrl,
    handleMoveActiveObject,
    handleCopyActiveObject,
    handleDeleteActiveFile,
    handleDecompressObject,
    fetchEncryptedFileList,
    handleAwsGetFileDetail,
    handleChangeStorageType,
    handleShareActiveObject,
    handleDownloadActiveFile,
    handleDownloadSingleFile,
    handleRecycleBinEmptyTrash,
    handleRecycleBinDeleteFiles,
    handleValidateEncryptedPassword,
    handleRecycleBinDeleteActiveFile,
  }
}
