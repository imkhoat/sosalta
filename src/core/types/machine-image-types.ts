export enum MACHINE_TYPE {
  PUBLIC = 'public',
  PRIVATE = 'private',
  TEAM = 'team',
}
export type MachineType = `${MACHINE_TYPE}`
export interface MachineImage {
  id: number
  amiId: string
  imageName: string
  imageInformation: string
  keyWords: string
  status: boolean
  machineImageTagEntitys: string[]
  type: MachineType
  createdBy: string
  machineConfiguration: {
    cpu: number
    memory: number
    method: string
    method2: string
    port: number
    port2: number
    urlPath: string
    mountPoint: string
    version: string
  }
  rootDriveSize: number
  gmtCreate: string | Date
  gmtUpdate: string | Date
  launchStateWebhookConfigured: boolean
}
