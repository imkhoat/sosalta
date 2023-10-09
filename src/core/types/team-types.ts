export interface Team {
  groupId: string
  groupName: string
  createrName: string
  owner: string
  modifiedBy: string
  gmtCreate: string | Date
  gmtUpdate: string | Date
  managerUser: boolean
  userCount: number
  headImageUrl: string
  gmtCreateAtString?: string
  gmtUpdateAtString?: string
}
