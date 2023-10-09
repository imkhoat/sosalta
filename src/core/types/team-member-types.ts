export interface TeamMember {
  auth: string
  createTime: string | number | Date
  gmtCreate: string | number | Date
  gmtCreateString?: string
  gmtUpdateString?: string
  gmtUpdate: string | number | Date
  groupId: string
  headImageS3Key: string
  isCreater: string
  lastMessageId: number | string
  lastModifyTime: string | number | Date
  manager: boolean
  type: number | string | TeamMemberType
  userName: string
  version: number | string
  managerString?: string
}

export enum TEAM_MEMBER_TYPE {
  ALL = 'ALL',
  MEMBER = 3,
  TEAM_MANAGER = 2,
  OWNER = 0,
}

export type TeamMemberType = `${TEAM_MEMBER_TYPE}`
