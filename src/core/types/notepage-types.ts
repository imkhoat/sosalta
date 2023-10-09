export interface Notepage {
  notePageId: string | number
  projectId: string | number
  pageName: string
  size: string | number
  createdBy: string
  modifiedBy: string
  owner: string
  gmtCreate: string | number | Date
  gmtUpdate: string | number | Date
  noteEntities: string
  currentSortType: string | number
  sortDirection: string | number
  gmtCreateAtString?: string
  gmtUpdateAtString?: string
}
