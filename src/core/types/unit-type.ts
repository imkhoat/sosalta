export type StorageUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB'

export enum BIT_UNIT {
  BYTE = 'BYTE',
  BIT = 'BIT',
  KB = 'KB',
  MB = 'MB',
  GB = 'GB',
  TB = 'TB',
}
export type BitUnit = `${BIT_UNIT}`
