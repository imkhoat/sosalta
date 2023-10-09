export interface PermissionRole {
  id: number
  module: 'member_user'
  owner: string
  type: PermissionRoleType
  roleName: string
  tooltip?: string
  defaultRole?: boolean
}

export type PermissionRoleType = 'default_role' | 'custom_role'
