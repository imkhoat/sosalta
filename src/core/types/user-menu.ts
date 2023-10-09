import { PermissionCodeType } from './permission-code-types'
import { PermissionInputType } from './permission-types'
import { TeamPermissionCodeType } from './team-permission-code-types'
export interface UserMenu {
  authType?: TeamPermissionCodeType
  checked: boolean
  children?: UserMenu[]
  icon?: string
  id?: number | string
  menuId?: number | string
  name?: string
  orderNum?: number
  parentId?: number | string
  type?: number | PermissionInputType
  unit?: string
  uri?: string
  value?: string | number
  visiable?: boolean
  code: PermissionCodeType
  title?: string
  label?: string
  isEdit?: boolean
}
