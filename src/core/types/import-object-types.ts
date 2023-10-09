export interface ImportObject {
  fileURL: string
  fileName: string
  filePath: string
  parentId: string
  progress: string
  status: number
  startTime: string | number | Date
  endTime: string | number | Date
  fileSize: string
  avgSpeed: string
  errMsg: string
  fileUploadId: string
  gmtCreate: string | number | Date
}
export enum IMPORT_STATUS {
  IMPORTING = '1',
  IMPORTED = '2',
  FAIL = '3',
  CANCELED = '4',
}

export type ImportStatus = `${IMPORT_STATUS}`
