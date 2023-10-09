import { RootDirType } from './root-dir-types'

export interface StorageFile {
  deleted?: boolean
  encrypted?: boolean
  fileFullPath?: string
  fileType?: StorageFileType
  fileTypeId?: string
  fileZipPath?: string
  folderFilesCount?: string | number
  folderSizeCount?: string | number
  gmtCreate?: string | number | Date
  gmtCreateString?: string
  gmtUpdate?: string | number | Date
  id: string
  lastModified?: string | number | Date
  md5Arr?: string[]
  metadata?: {
    originalName?: string
    suggestedName?: string
  }
  name?: string
  parentId?: string
  s3FileKey?: string
  size?: string | number
  status?: StorageFileStatus
  storageClass?: StorageClass | string
  systemAssigned?: boolean
  userChangeFileType?: string
  userName?: string
  rootDirType: RootDirType | undefined
}

export enum STORAGE_FILE_STATUS {
  AVALIABLE = '0',
  UNAVALIABLE = '1',
  FROZENING = '2',
  THAWING = '3',
  COOLING = '4',
  WARMING = '5',
  LOCKING = '6',
}

export enum STORAGE_FILE_TYPE {
  DOCX = 'docx',
  SYS_FOLDER = 'sys-folder',
  FOLDER = 'folder',
  SVG = 'svg',
  XLSX = 'xlsx',
  PDF = 'pdf',
  TXT = 'txt',
  PNG = 'png',
  JPG = 'jpg',
  JPEG = 'jpeg',
  GIF = 'gif',
  JSON = 'json',
  TSV = 'tsv',
  CSV = 'csv',
  MD = 'md',
  HTML = 'html',
  MP4 = 'mp4',
  MP3 = 'mp3',
  OGG = 'ogg',
}

export type StorageFileType = `${STORAGE_FILE_TYPE}`

export type StorageFileStatus = `${STORAGE_FILE_STATUS}`

export enum DIR_TYPE {
  STORAGE = 'STORAGE',
  ENCRYPT = 'ENCRYPT',
  PROJECT = 'PROJECT',
  TEAM = 'TEAM',
  DATA_DRIE = 'DATA_DRIVE',
  TRASH = 'TRASH',
  MEMBER_USER = 'MEMBER_USER',
}

export type DirType = `${DIR_TYPE}`

export enum ATLAS_FILE_SYSTEM {
  DEFAULT_FILE_SYSTEM = 'DEFAULT_FILE_SYSTEM',
  TEAM_FILE_SYSTEM = 'TEAM_FILE_SYSTEM',
  PROJECT_FILE_SYSTEM = 'PROJECT_FILE_SYSTEM',
  DATA_DRIVE_FILE_SYSTEM = 'DATA_DRIVE_FILE_SYSTEM',
  DEVELOPER_CENTER_FILE_SYSTEM = 'DEVELOPER_CENTER_FILE_SYSTEM',
}

export type AtlasFileSystem = `${ATLAS_FILE_SYSTEM}`

export enum STORAGE_CLASS {
  STANDARD_IA = 'Standard_IA',
  STANDARD = 'Standard',
  GLACIER = 'Glacier',
}
export type StorageClass = `${STORAGE_CLASS}`
