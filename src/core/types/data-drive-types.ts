export interface DataDrive {
  dataDriveId: string
  fileSystemId: string
  driveName: string
  locked: boolean
  userName: string
  gmtCreate: string | Date
  gmtUpdate: string | Date
}
