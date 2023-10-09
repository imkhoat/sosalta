import { UploadStatus } from './upload-status'

export interface UploadFile {
  file: File
  parentId: string
  progress?: number
  status?: UploadStatus
}
