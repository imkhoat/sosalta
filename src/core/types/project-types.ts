export interface Project {
  projectId: number | string
  projectName: string
  projectDescription: string
  projectTeamId: string
  owner: string
  modifiedBy: string
  keyWords: string[]
  gmtCreate: string | Date
  gmtUpdate: string | Date
  gmtCreateAtString?: string
  gmtUpdateAtString?: string
  projectProperties: {
    id: string
    projectId: string
    ppKey: string
    ppValue: string
  }[]
  notePageCount: number | string
  isManager: boolean
}
