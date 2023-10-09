export interface FolderNode {
  id: string
  name: string
  isParent: boolean
  type?: 'folder'
  s3FileKey?: string | null
  size?: string
  parentId?: string
  bucketName?: string
  filePathItems?: {
    id: string
    name: string
  }[]
  children?: FolderNode[]
  parent?: boolean
  lazy?: boolean
  icon?: string
  selectable?: boolean
}
