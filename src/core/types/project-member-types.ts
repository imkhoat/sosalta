export interface ProjectMember {
  userName: string
  headImageS3Key: string
  phoneNumber: string | number
  managerUser: boolean
  email: string
  gmtCreated: string | number | Date
  gmtCreateString?: string
  gmtUpdateString?: string
  managerString?: string
  type?: number | string | ProjectMemberType
}

export enum PROJECT_MEMBER_TYPE {
  ALL = 'ALL',
  MEMBER = 3,
  PROJECT_MANAGER = 2,
  OWNER = 0,
}

export type ProjectMemberType = `${PROJECT_MEMBER_TYPE}`
