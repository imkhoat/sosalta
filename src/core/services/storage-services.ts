import { https } from 'boot/axios'
import { API } from './utils/apis'
import { errorHandler } from 'src/core/utils/error-handler'
import {
  CreateBaseFolderResponse,
  GetFileListRequest,
  GetFileListResponse,
  MoveObjectRequest,
  MoveObjectResponse,
  DeleteObjectsRequest,
  DeleteObjectsResponse,
  RenameObjectRequest,
  RenameObjectResponse,
  CreateFolderRequest,
  CreateFolderResponse,
  GetFileUrlRequest,
  GetFileUrlResponse,
  DownloadFilesRequest,
  DownloadFilesResponse,
  GetUnzipSupportTypesResponse,
  GetFolderTreeRequest,
  GetFolderTreeResponse,
  FileUnzipRequest,
  FileUnzipResponse,
  CopyObjectsRequest,
  CopyObjectsResponse,
  MoveObjectsRequest,
  MoveObjectsResponse,
  DecryptObjectRequest,
  DecryptObjectResponse,
  GetEncryptionKeysResponse,
  EncryptObjectsRequest,
  EncryptObjectsResponse,
  ImportFilesRequest,
  ImportFilesResponse,
  CreateNewFileRequest,
  CreateNewFileResponse,
  GetDecryptFileListRequest,
  GetDecryptFileListResponse,
  GetSessionCredentialsRequest,
  GetSessionCredentialsResponse,
  DupplicateCheckRequest,
  DupplicateCheckResponse,
  GetS3FileKeyRequest,
  GetS3FileKeyResponse,
  UploadFileRequest,
  UploadFileResponse,
  GetUserSymmetricKeyListResponse,
  UpdateUserMasterPasswordRequest,
  UpdateUserMasterPasswordResponse,
  AddSymmetricKeyRequest,
  AddSymmetricKeyResponse,
  UploadSymmetricKeyRequest,
  UploadSymmetricKeyResponse,
  CreateKeyManagerPasswordRequest,
  CreateKeyManagerPasswordResponse,
  SearchFileListRequest,
  ShareObjectRequest,
  ShareObjectResponse,
  GetImportProgressListResponse,
  GetImportProgressListRequest,
  GetStorageUsageResponse,
  GetFileSystemHashResponse,
  UpdateFileRequest,
  UpdateFileResponse,
} from '../types/services/storage-types'
import { StorageClass } from '../types/file-types'
/**
 * Create base folder after register success
 * @param userName
 */
async function httpsCreateBaseFolder(userName: string) {
  try {
    const { data } = await https.post<CreateBaseFolderResponse>(
      API.STORAGE.CREATE_BASE_FOLDER,
      null,
      {
        params: {
          userName,
        },
      }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Delete single file by id
 * @param fileId
 */
async function httpsDeleteFile(fileId: string) {
  try {
    const { data } = await https.post<CreateBaseFolderResponse>(
      API.STORAGE.DELETE_OBJECTS,
      null,
      {
        params: {
          fileId,
        },
      }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Get list objects ( files, folders)
 * @param params
 */
async function httpsGetFileList(params: GetFileListRequest) {
  try {
    const { data } = await https.post<GetFileListResponse>(
      API.STORAGE.GET_FILE_LIST,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Get list objects ( files, folders)
 * @param params
 */
async function httpsSearchFileList(params: SearchFileListRequest) {
  try {
    const { data } = await https.post<GetFileListResponse>(
      API.STORAGE.SEARCH_FILE_LIST,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Move objects (files, folders)
 * @param params
 */
async function httpsMoveObject(params: MoveObjectRequest) {
  try {
    const { data } = await https.post<MoveObjectResponse>(
      API.STORAGE.MOVE_OBJECT,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Delete objects (files, folders)
 * @param params
 */
async function httpsDeleteObjects(params: DeleteObjectsRequest) {
  try {
    const { data } = await https.post<DeleteObjectsResponse>(
      API.STORAGE.DELETE_OBJECTS,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Rename object (file, folder)
 * @param params
 */
async function httpsRenameObject(params: RenameObjectRequest) {
  try {
    const { data } = await https.post<RenameObjectResponse>(
      API.STORAGE.RENAME_OBJECT,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Share object (file, folder)
 * @param params
 */
async function httpsShareObject(params: ShareObjectRequest) {
  try {
    const { data } = await https.post<ShareObjectResponse>(
      API.STORAGE.SHARE_OBJECT,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Create new folder
 * @param params
 */
async function httpsCreateFolder(params: CreateFolderRequest) {
  try {
    const { data } = await https.post<CreateFolderResponse>(
      API.STORAGE.CREATE_FOLDER,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Get file url
 * @param params
 */
async function httpsGetFileUrl(params: GetFileUrlRequest) {
  try {
    const { data } = await https.post<GetFileUrlResponse>(
      API.STORAGE.GET_FILE_URL,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Download single file
 * @param link
 * @param fileName
 * @param fileType
 */
function httpsDownloadFile(
  link: string,
  fileName?: string | undefined,
  fileType?: string | undefined
) {
  const fileLink = document.createElement('a')

  fileLink.href = link
  fileLink.setAttribute('download', fileName || `NoName.${fileType}`)
  fileLink.setAttribute('target', '_blank')
  fileLink.click()
  fileLink.remove()
}

/**
 * Download mutiple files, folders
 * @param params
 */
async function httpsDownloadFiles(params: DownloadFilesRequest) {
  try {
    const { data } = await https.post<DownloadFilesResponse>(
      API.STORAGE.BATCH_DOWNLOAD,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsDownloadBlobData(data: BlobPart) {
  try {
    const downloadUrl = window.URL.createObjectURL(new Blob([data]))
    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', 'Download.zip') //any other extension
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetUnzipSupportTypes() {
  try {
    const { data } = await https.get<GetUnzipSupportTypesResponse>(
      API.STORAGE.GET_UNZIP_SUPPORT_TYPES
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetFolderTree(query: GetFolderTreeRequest) {
  try {
    const { data } = await https.post<GetFolderTreeResponse>(
      API.STORAGE.GET_FOLDER_TREE,
      null,
      {
        params: query,
      }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsFileUnzip(params: FileUnzipRequest) {
  try {
    const { data } = await https.post<FileUnzipResponse>(
      API.STORAGE.FILE_UNZIP,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCopyObjects(params: CopyObjectsRequest) {
  try {
    const { data } = await https.post<CopyObjectsResponse>(
      API.STORAGE.COPY_OBJECTS,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsMoveObjects(params: MoveObjectsRequest) {
  try {
    const { data } = await https.post<MoveObjectsResponse>(
      API.STORAGE.MOVE_OBJECTS,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsDecryptObject(params: DecryptObjectRequest) {
  try {
    const { data } = await https.post<DecryptObjectResponse>(
      API.STORAGE.DECRYPT_OBJECT,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetEncryptionKeys() {
  try {
    const { data } = await https.post<GetEncryptionKeysResponse>(
      API.STORAGE.GET_ENCRYPTION_KEYS
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsEncryptObjects(params: EncryptObjectsRequest) {
  try {
    const { data } = await https.post<EncryptObjectsResponse>(
      API.STORAGE.ENCRYPT_OBJECT,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsImportFiles(params: ImportFilesRequest) {
  try {
    const { data } = await https.post<ImportFilesResponse>(
      API.STORAGE.CREATE_FTP_TASK,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCreateNewFile(params: CreateNewFileRequest) {
  try {
    const { data } = await https.post<CreateNewFileResponse>(
      API.STORAGE.UPLOAD_NEW_FILE,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUpdateFile(params: UpdateFileRequest) {
  try {
    const { data } = await https.post<UpdateFileResponse>(
      API.STORAGE.UPDATE_OBJECT,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Get list encrypted objects ( files, folders)
 * @param params
 */
async function httpsGetDecryptFileList(params: GetDecryptFileListRequest) {
  try {
    const { data } = await https.post<GetDecryptFileListResponse>(
      API.STORAGE.GET_DECRYPT_FILE_LIST,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Get list encrypted objects ( files, folders)
 * @param params
 */
async function httpsGetFileSystemHash(params: { masterPassword: string }) {
  try {
    const { data } = await https.post<GetFileSystemHashResponse>(
      API.STORAGE.GET_FILE_SYSTEM_HASH,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Get list encrypted objects ( files, folders)
 * @param params
 */
async function httpsGetSessionCredentials(
  params: GetSessionCredentialsRequest
) {
  try {
    const { data } = await https.post<GetSessionCredentialsResponse>(
      API.STORAGE.GET_SESSION_CREDENTIALS,
      null,
      {
        params,
      }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsDupplicateCheck(params: DupplicateCheckRequest) {
  try {
    const { data } = await https.post<DupplicateCheckResponse>(
      API.STORAGE.DUPPLICATE_CHECK,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetS3FileKey(params: GetS3FileKeyRequest) {
  try {
    const { data } = await https.post<GetS3FileKeyResponse>(
      API.STORAGE.GET_S3_FILE_KEY,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUploadFile(params: UploadFileRequest) {
  try {
    const { data } = await https.post<UploadFileResponse>(
      API.STORAGE.UPLOAD_FILE,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUploadMemberFile(params: UploadFileRequest) {
  try {
    const { data } = await https.post<UploadFileResponse>(
      API.STORAGE.UPLOAD_MEMBER_FILE,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetUserSymmetricKeyList() {
  try {
    const { data } = await https.post<GetUserSymmetricKeyListResponse>(
      API.STORAGE.GET_USER_SYMMETRIC_KEY_LIST
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUpdateUserMasterPassword(
  params: UpdateUserMasterPasswordRequest
) {
  try {
    const { data } = await https.post<UpdateUserMasterPasswordResponse>(
      API.STORAGE.UPDATE_USER_MASTER_PASSWORD,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsAddSymmetricKey(params: AddSymmetricKeyRequest) {
  try {
    const { data } = await https.post<AddSymmetricKeyResponse>(
      API.STORAGE.ADD_SYMMETRIC_KEY,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUploadSymmetricKey(params: UploadSymmetricKeyRequest) {
  try {
    const { data } = await https.post<UploadSymmetricKeyResponse>(
      API.STORAGE.UPLOAD_SYMMECTRIC_KEY,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCreateKeyManagerPassword(
  params: CreateKeyManagerPasswordRequest
) {
  try {
    const { data } = await https.post<CreateKeyManagerPasswordResponse>(
      API.STORAGE.INITIAL_USER_KEY_LIB,
      null,
      { params }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetImportProgressList(
  payload: GetImportProgressListRequest
) {
  try {
    const { data } = await https.post<GetImportProgressListResponse>(
      API.STORAGE.GET_IMPORT_PROGRESS,
      null,
      { params: payload }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Change objects ( files, folders) storage class
 * @param params
 */
async function httpsChangeToFrequentStatus(id: string | undefined) {
  try {
    const { data } = await https.post<GetFileListResponse>(
      API.STORAGE.COLD_FILE_TO_HOT,
      { id }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Change objects ( files, folders) storage class
 * @param params
 */
async function httpsChangeToArchiveStatus(id: string | undefined) {
  try {
    const { data } = await https.post<GetFileListResponse>(
      API.STORAGE.FROZEN_FILE,
      { id }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Change objects ( files, folders) storage class
 * @param params
 */
async function httpsChangeToInfrequentStatus(id: string | undefined) {
  try {
    const { data } = await https.post<GetFileListResponse>(
      API.STORAGE.COLD_FILE,
      { id }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}
/**
 * Empty trash objects ( files, folders) storage class
 * @param params
 */
async function httpsRecycleBinEmptyTrash(payload: {
  bucketName: string
  parentId: string
}) {
  try {
    const { data } = await https.post<GetFileListResponse>(
      API.STORAGE.RECYCLE_BIN_EMPTY_TRASH,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}
/**
 * Delete trash objects ( files, folders) storage class
 * @param params
 */
async function httpsRecycleBinDelete(payload: {
  bucketName: string
  items: { id: string | undefined; name: string | undefined }[]
}) {
  try {
    const { data } = await https.post<GetFileListResponse>(
      API.STORAGE.RECYCLE_BIN_DELETE,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}
/**
 * Get storage usage
 * @param params
 */
async function httpsGetStorageUsage(payload: { userName: string }) {
  try {
    const { data } = await https.post<GetStorageUsageResponse>(
      API.STORAGE.GET_STORAGE_USAGE,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

export {
  httpsFileUnzip,
  httpsMoveObject,
  httpsUploadFile,
  httpsDeleteFile,
  httpsGetFileUrl,
  httpsUpdateFile,
  httpsCopyObjects,
  httpsMoveObjects,
  httpsImportFiles,
  httpsShareObject,
  httpsGetFileList,
  httpsRenameObject,
  httpsCreateFolder,
  httpsDownloadFile,
  httpsGetS3FileKey,
  httpsCreateNewFile,
  httpsDecryptObject,
  httpsDeleteObjects,
  httpsDownloadFiles,
  httpsGetFolderTree,
  httpsSearchFileList,
  httpsEncryptObjects,
  httpsGetStorageUsage,
  httpsAddSymmetricKey,
  httpsDupplicateCheck,
  httpsUploadMemberFile,
  httpsCreateBaseFolder,
  httpsDownloadBlobData,
  httpsRecycleBinDelete,
  httpsGetEncryptionKeys,
  httpsGetFileSystemHash,
  httpsUploadSymmetricKey,
  httpsGetDecryptFileList,
  httpsRecycleBinEmptyTrash,
  httpsGetUnzipSupportTypes,
  httpsGetImportProgressList,
  httpsChangeToFrequentStatus,
  httpsChangeToArchiveStatus,
  httpsChangeToInfrequentStatus,
  httpsGetSessionCredentials,
  httpsGetUserSymmetricKeyList,
  httpsCreateKeyManagerPassword,
  httpsUpdateUserMasterPassword,
}
