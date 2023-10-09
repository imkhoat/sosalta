import { HttpsResponse } from './https-response'
import { Pagging } from 'src/core/types/pagging-types'
import { DataDrive } from 'src/core/types/data-drive-types'
import { MachineImage, MachineType } from '../machine-image-types'
import { UserInfo } from '../user-info'
import {
  MachineInstanceType,
  MachineServerError,
  MachineInstance,
  MachineInstanceDetail,
} from '../machine-instance-types'
import { MachineInstanceLimit } from '../machine-instance-limit-types'
interface GetDataDrivesData extends Pagging {
  errorMsg?: string
  list: DataDrive[]
}
interface GetMachineImagesData extends Pagging {
  errorMsg?: string
  list: MachineImage[]
}
interface GetMachineInstancesList extends Pagging {
  errorMsg?: string
  list: MachineInstance[]
}
export interface GetDataDrivesResponse extends HttpsResponse {
  data: GetDataDrivesData
}

export interface GetDataDrivesRequest {
  page?: number
  limit?: number
  dataDriveName?: string
  userName?: string
  locked?: 0 | 1
}

export interface CheckDataDriveNameResponse extends HttpsResponse {
  data: string
}

export interface DeleteDataDriveResponse extends HttpsResponse {
  data: string
}

export interface RenameDataDriveResponse extends HttpsResponse {
  data: string
}

export interface GetMachineImagesRequest {
  limit?: number
  page?: number
  type: MachineType
  groupId?: number
  imageName?: string
  username?: string
}

export interface GetMachineImagesResponse extends HttpsResponse {
  data: GetMachineImagesData
}

export interface GetTeamListResponse extends HttpsResponse {
  data: { groupId: string; groupName: string }[]
}

export interface GetMemberListResponse extends HttpsResponse {
  data: UserInfo[]
}

export interface GetMachineImageDetailResponse extends HttpsResponse {
  data: MachineImage
}

export interface GetMachineImageDetailRequest {
  groupId?: string | number
  id: number
  type?: MachineType
  username?: string
}

export interface GetMachineInstanceLimitResponse extends HttpsResponse {
  data: MachineInstanceLimit
  map: {
    result: boolean
    maxLimit: number
    subUserMemberLimit: any
  }
}

export interface GetMachineInstanceCountResponse extends HttpsResponse {
  data: {
    numOfRunningMachineCurrentUser: number
    numOfRunningMachineAllUsers: number
  }
}

export interface GetMachineInstanceTypesResponse extends HttpsResponse {
  data: MachineInstanceType[]
}

export interface LauchCloudPCInstanceRequest {
  amiId: string
  dataDriveId: string
  dataDriveSize: string
  instanceName: string
  rootDriveSize: number
  runningDuration?: number
  timingShutdown: 'true' | 'false'
  type: string
}

export interface EstimateLauchCloudPCInstanceRequest {
  amiId: string
  dataDriveId: string
  dataDriveSize: string
  instanceName: string
  rootDriveSize: number
  runningDuration?: number
  timingShutdown: 'true' | 'false'
  type: string
}

export interface LauchCloudPCInstanceResponse extends HttpsResponse {
  data: string | MachineServerError
  duration: string | number
}

export interface GetMachineInstancesListRequest {
  category: 'History' | 'Current' | 'WaitingInQueue' | 'Paused' | 'Running'
  createdBy: string
  instanceName: string
  page: number
  size: number
}
export interface GetMachineInstancesListResponse extends HttpsResponse {
  data: GetMachineInstancesList
}

export interface GetMachineInstancesDetailResponse extends HttpsResponse {
  data: MachineInstanceDetail
}

export interface ShutdownMachineInstanceResponse extends HttpsResponse {
  data: string
}

export interface ShutdownMachineInstanceRequest {
  machineInstanceId?: string
  saveAsImage?: boolean
  imageName?: string
  imageInformation?: string
  keyWords: string[]
  machineImageTagEntity: { amiKey?: string; amiValue?: string }[]
  type?: 'private' | 'team'
  groupId?: string
  machineConfiguration: {
    cpu?: string
    memory?: string
    port?: string
    port2?: string
    urlPath?: string
    mountPoint?: string
    method?: string
    method2?: string
    version?: string
  }
  rootDriveSize?: string
}

export interface GetListTeamGroupResponse extends HttpsResponse {
  data: { groupId: string; groupName: string }[]
}
