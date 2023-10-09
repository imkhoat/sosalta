import { HttpsResponse } from './https-response'
import {
  StorageClass,
  StorageFile,
  StorageFileType,
} from 'src/core/types/file-types'
import { FolderNode } from 'src/core/types/folder-node-types'
import { EncryptionKey } from 'src/core/types/encryption-key-types'
import { AtlasFileSystem } from 'src/core/types/file-types'
import { Credential } from 'src/core/types/credential-types'
import { UserInfo } from 'src/core/types/user-info'
import { Pagging } from '../pagging-types'
import { ImportObject } from '../import-object-types'
import { UserStorage } from 'src/core/types/user-storage-types'
export interface CreateBaseFolderRequest {
  userName: string
}

export interface CreateBaseFolderResponse extends HttpsResponse {
  data: {
    errorMsg?: string
  }
}

export interface GetImportProgressList extends Pagging {
  list: ImportObject[]
}

export interface GetFileListRequest {
  bucketName: string
  limit?: string | number
  parentId: string
  lastEvaluatedFile?: number
}

export interface SearchFileListRequest {
  bucketName: string
  deleted?: number
  limit?: number
  pageCount?: number
  parentId: string
  searchName?: string
  userName?: string
}
export interface GetFileListResponse extends HttpsResponse {
  data: {
    fileCountTotal: number
    items: StorageFile[]
    lastEvaluatedFile?: number
    pages: number
    rootItem: StorageFile
    total: number
  }
}

export interface MoveObjectRequest {
  bucketName: string
  limit: string | number
  parentId: string
}

export interface MoveObjectResponse extends HttpsResponse {
  data: {
    fileCountTotal: number
    items: StorageFile[]
    lastEvaluatedFile: string
    pages: number
    rootItem: File
    total: number
  }
}

export interface DeleteObjectsRequest {
  bucketName: string
  items: { id: string; name: string | undefined }[]
  projectTeamId: string
}

export interface DeleteObjectsResponse extends HttpsResponse {
  data: {
    items: { id: string; name: string }[]
  }
}

export interface RenameObjectRequest {
  destinationName: string
  item: {
    id: string
  }
  projectTeamId: string
}

export interface RenameObjectResponse extends HttpsResponse {
  data: {
    items: { id: string; name: string }[]
  }
}

export interface CreateFolderRequest {
  item: {
    name: string
    parentId: string
    fileType: 'folder'
    bucketName: string
    storageClass: StorageClass | string
    lastModified?: string | Date
    pseudoLastModifed?: string | Date
  }
}

export interface CreateFolderResponse extends HttpsResponse {
  data: string
}

export interface GetFileUrlRequest {
  item: {
    id: string
  }
}

export interface GetFileUrlResponse extends HttpsResponse {
  data: string
}

export interface DownloadFilesRequest {
  items: string[]
}

export interface DownloadFilesResponse extends HttpsResponse {
  data: {
    items: { id: string; name: string }[]
  }
}

export interface GetUnzipSupportTypesResponse extends HttpsResponse {
  data: { type: string; typeId: number | string }[]
}

export interface GetFolderTreeRequest {
  id: string
  name: string
  recursive?: boolean
  withFileNode?: boolean
}

export interface GetFolderTreeResponse extends HttpsResponse {
  data: FolderNode[]
}

export interface FileUnzipRequest {
  fileId: string
  parentId: string
}

export interface FileUnzipResponse extends HttpsResponse {
  data: string
}

export interface CopyObjectsRequest {
  items: {
    id: string
    name: string
  }[]
  bucketName: string
  destinationParentId: string
  operate: 'copy'
}

export interface CopyObjectsResponse extends HttpsResponse {
  data: string | StorageFile[]
}

export interface MoveObjectsRequest {
  items: {
    id: string
    name: string
  }[]
  bucketName: string
  destinationParentId: string
  operate: 'move'
}

export interface MoveObjectsResponse extends HttpsResponse {
  data: string | StorageFile[]
}

export interface DecryptObjectRequest {
  items: {
    id: string
    name: string
    size: string | number
  }[]
  masterPassword: string
  parentId: string
}

export interface DecryptObjectResponse extends HttpsResponse {
  data: string | StorageFile[]
}

export interface GetEncryptionKeysResponse extends HttpsResponse {
  data: EncryptionKey[]
}

export interface EncryptObjectsRequest {
  items: {
    id: string
    name: string
    size: string | number
  }[]
  masterPassword: string
  parentId: string
  index?: number
  projectTeamId?: string
}
export interface EncryptObjectsResponse extends HttpsResponse {
  data: string
}

export interface ImportFilesRequest {
  fileImportVOList: {
    fileURL: string
    fileName: string
    filePath: string
    parentId?: string
    progress?: number
    status?: number
    errMsg?: string | null
  }[]
  isPublic: boolean
  ftpUserName?: string
  ftpPassWord?: string
}

export interface ImportFilesResponse extends HttpsResponse {
  data: string
}

export type NewFileType = 'TXT' | 'WORD' | 'MARKDOWN' | 'HTML'

export interface CreateNewFileRequest {
  fileString: string
  fileType: StorageFileType
  fileName: string
  bucketName: string
  parentId: string
}
export interface UpdateFileRequest {
  fileString: string
  fileType: StorageFileType
  fileId: string
}

export interface CreateNewFileResponse extends HttpsResponse {
  data: StorageFile
}
export interface UpdateFileResponse extends HttpsResponse {
  data: StorageFile
}

export interface GetDecryptFileListRequest {
  fileSystemKey?: string
  parentId: string
  masterPassword: string
  page?: number | string
  limit?: number | string
}

export interface GetDecryptFileListResponse extends HttpsResponse {
  data: {
    lastEvaluatedFile?: number
    fileCountTotal: number
    items: StorageFile[]
    fileSystemKey: string
    pages: number
    total: number
  }
}

export interface GetFileSystemHashResponse extends HttpsResponse {
  data: string
}

export interface GetSessionCredentialsRequest {
  prefix: string
  type: AtlasFileSystem
}
export interface GetSessionCredentialsResponse extends HttpsResponse {
  data: Credential
}

export interface DupplicateCheckRequest {
  items: {
    name: string
  }[]
  destinationParentId: string
}

export interface DupplicateCheckResponse extends HttpsResponse {
  data: string
}

export interface GetS3FileKeyRequest {
  dataDriveId?: string
  item: {
    name: string
    parentId: string
  }
}

export interface GetS3FileKeyResponse extends HttpsResponse {
  data: string
}

export interface UploadFileRequest {
  item: {
    name: string
    parentId: string
    s3FileKey: string
    fileType: string
    bucketName: string
    storageClass: StorageClass | string
    size: string | number
    lastModified: string | Date
    pseudoLastModifed: string
    partNumber: string | number
    md5Arr: string[]
  }
}

export interface UploadFileResponse extends HttpsResponse {
  data: StorageFile
  optionalData: {
    itemSizeInMB: number | string
    itemSize: number | string
    itemSizeInKB: number | string
  }
}

export interface GetUserSymmetricKeyListResponse extends HttpsResponse {
  data: SymmetricKey[]
}

export interface UpdateUserMasterPasswordRequest {
  masterPassword: string
  newPassword: string
}

export interface UpdateUserMasterPasswordResponse extends HttpsResponse {
  data: UserInfo
}

export interface AddSymmetricKeyRequest {
  masterPassword: string
  name: string
}

export interface AddSymmetricKeyResponse extends HttpsResponse {
  data: string
}

export interface UploadSymmetricKeyRequest {
  masterPassword: string
  symmetricKeyStr: string
  keyName: string
}

export interface UploadSymmetricKeyResponse extends HttpsResponse {
  data: string
}

export interface CreateKeyManagerPasswordRequest {
  keyLibPassword: string
}

export interface CreateKeyManagerPasswordResponse extends HttpsResponse {
  data: UserInfo | string
}

export interface ShareObjectRequest {
  sender: string
  receiver: string
  shareFileId: string
  fileSize: string
  newName: string
}

export interface ShareObjectResponse extends HttpsResponse {
  data: StorageFile[] | string
}

export interface GetImportProgressListResponse extends HttpsResponse {
  data: GetImportProgressList
}

export interface GetImportProgressListRequest {
  limit?: number
  page?: number
  status?: string
}

export interface GetStorageUsageResponse extends HttpsResponse {
  data: UserStorage
}
