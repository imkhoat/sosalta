import { NoteValueType } from './note-value-type'

export interface Note {
  noteId: number
  notePageId: number
  noteKey: string
  valueType: NoteValueType
  noteValue: { value: string }[] | string
  remarks: string | undefined
  delete: boolean
  createdBy: string
  modifiedBy: string
  reason: string
  beyond: string
  gmtCreate: string | number | Date
  gmtUpdate: string | number | Date
  sortNo: number
  s3FileKey: string
  s3FileStoredTimestamp: string | number | Date
  star: boolean
  noteHistoryId?: number
  gmtCreateString?: string
  gmtCreateAtString?: string
  gmtUpdateAtString?: string
  gmtUpdateString?: string
}
