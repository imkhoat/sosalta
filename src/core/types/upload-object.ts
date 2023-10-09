import { STORAGE_CLASS } from './file-types'
import { PartData } from './part-data-types'

export interface UploadDataObject {
  file: File
  partData: PartData
  s3FileKey: string
  uploadId: string
  parentId: string
  uploadStatus: 'CANCEL' | 'PENDING' | 'DUPPLICATE' | 'SUCCESS' | 'ERROR'
  storageClass: STORAGE_CLASS.STANDARD
}
