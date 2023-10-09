import { https } from 'boot/axios'
import { API } from './utils/apis'
import { errorHandler } from 'src/core/utils/error-handler'
import {
  CheckDataDriveNameResponse,
  DeleteDataDriveResponse,
  GetDataDrivesRequest,
  GetDataDrivesResponse,
  RenameDataDriveResponse,
  GetMachineImagesRequest,
  GetMachineImagesResponse,
  GetTeamListResponse,
  GetMemberListResponse,
  GetMachineImageDetailResponse,
  GetMachineImageDetailRequest,
  GetMachineInstanceLimitResponse,
  GetMachineInstanceCountResponse,
  GetMachineInstanceTypesResponse,
  LauchCloudPCInstanceRequest,
  EstimateLauchCloudPCInstanceRequest,
  LauchCloudPCInstanceResponse,
  GetMachineInstancesListRequest,
  GetMachineInstancesListResponse,
  GetMachineInstancesDetailResponse,
  ShutdownMachineInstanceResponse,
  ShutdownMachineInstanceRequest,
  GetListTeamGroupResponse,
} from '../types/services/machine-types'

/**
 * Get data drive list
 */
async function httpsGetDataDrives(payload: GetDataDrivesRequest) {
  try {
    const { data } = await https.get<GetDataDrivesResponse>(
      API.MACHINE.GET_DATA_DRIVES,
      { params: payload }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetDataDrivesByUserName(userName: string) {
  try {
    const { data } = await https.get<GetDataDrivesResponse>(
      API.MACHINE.GET_DATA_DRIVES,
      {
        params: { userName },
      }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCheckDataDriveName(driveName: string, userName: string) {
  try {
    const payload = {
      driveName,
      userName,
    }
    const { data } = await https.post<CheckDataDriveNameResponse>(
      API.MACHINE.CHECK_DATA_DRIVE_NAME,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCreateDataDrive(driveName: string, userName: string) {
  try {
    const payload = {
      driveName,
      userName,
    }
    const { data } = await https.post<CheckDataDriveNameResponse>(
      API.MACHINE.CREATE_DATA_DRIVE,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsDeleteDataDrive(driveId: string | number) {
  try {
    const { data } = await https.get<DeleteDataDriveResponse>(
      `${API.MACHINE.DELETE_DATA_DRIVE}/${driveId}`
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsRenameDataDrive(
  dataDriveId: string | number,
  driveName: string
) {
  try {
    const { data } = await https.post<RenameDataDriveResponse>(
      API.MACHINE.RENAME_DATA_DRIVE,
      {
        dataDriveId,
        driveName,
      }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Get machine images list
 */
async function httpsGetMachineImages(payload: GetMachineImagesRequest) {
  try {
    const { data } = await https.get<GetMachineImagesResponse>(
      API.MACHINE.GET_MACHINE_IMAGES_LIST,
      { params: payload }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetTeamList() {
  try {
    const { data } = await https.get<GetTeamListResponse>(
      API.MACHINE.GET_TEAM_LIST
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetMemberList() {
  try {
    const { data } = await https.get<GetMemberListResponse>(
      API.USER.GET_MEMBER_USERS
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetMachineImageDetail(
  payload: GetMachineImageDetailRequest
) {
  try {
    const { data } = await https.get<GetMachineImageDetailResponse>(
      API.MACHINE.GET_MACHINE_IMAGE_DETAIL,
      { params: payload }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetMachineInstanceLimit() {
  try {
    const { data } = await https.get<GetMachineInstanceLimitResponse>(
      API.MACHINE.GET_MACHINE_LIMIT
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetMachineInstanceCount() {
  try {
    const { data } = await https.get<GetMachineInstanceCountResponse>(
      API.MACHINE.GET_MACHINE_LIMIT
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetMachineInstanceTypes(amiId: string) {
  try {
    const { data } = await https.get<GetMachineInstanceTypesResponse>(
      API.MACHINE.GET_MACHINE_INSTANCE_TYPES,
      {
        params: { amiId },
      }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsLaunchCloudPCInstance(
  payload: LauchCloudPCInstanceRequest
) {
  try {
    const { data } = await https.post<LauchCloudPCInstanceResponse>(
      API.MACHINE.LAUNCH_CLOUD_PC_INSTANCE,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsEstimateLaunchCloudPCInstance(
  payload: EstimateLauchCloudPCInstanceRequest
) {
  try {
    const { data } = await https.post<LauchCloudPCInstanceResponse>(
      API.MACHINE.ESTIMATE_LAUNCH_INSTANCE,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetMachineInstancesList(
  payload: GetMachineInstancesListRequest
) {
  try {
    const { data } = await https.post<GetMachineInstancesListResponse>(
      API.MACHINE.GET_MACHINE_INSTANCES_LIST,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetMachineInstancesDetail(instanceId: string) {
  try {
    const { data } = await https.get<GetMachineInstancesDetailResponse>(
      `${API.MACHINE.GET_MACHINE_INSTANCE_DETAIL}/${instanceId}`
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsStartdownMachineInstances(instanceId: string) {
  try {
    const { data } = await https.get<ShutdownMachineInstanceResponse>(
      `${API.MACHINE.STARTDOWN_MACHINE_INSTANCE}/${instanceId}`
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsShutdownMachineInstances(
  payload: ShutdownMachineInstanceRequest
) {
  try {
    const { data } = await https.post<ShutdownMachineInstanceResponse>(
      API.MACHINE.SHUTDOWN_MACHINE_INSTANCE,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsPauseMachineInstances(instanceId: string) {
  try {
    const { data } = await https.post<ShutdownMachineInstanceResponse>(
      `${API.MACHINE.PAUSE_MACHINE_INSTANCE}/${instanceId}`
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsResumeMachineInstances(instanceId: string) {
  try {
    const { data } = await https.post<ShutdownMachineInstanceResponse>(
      `${API.MACHINE.RESUME_MACHINE_INSTANCE}/${instanceId}`
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetListTeamGroup() {
  try {
    const { data } = await https.get<GetListTeamGroupResponse>(
      API.MACHINE.SHUTDOWN_MACHINE_LIST_GROUP
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

export {
  httpsGetTeamList,
  httpsGetMemberList,
  httpsGetDataDrives,
  httpsRenameDataDrive,
  httpsCreateDataDrive,
  httpsDeleteDataDrive,
  httpsGetMachineImages,
  httpsGetListTeamGroup,
  httpsCheckDataDriveName,
  httpsPauseMachineInstances,
  httpsGetMachineImageDetail,
  httpsLaunchCloudPCInstance,
  httpsResumeMachineInstances,
  httpsGetMachineInstanceTypes,
  httpsGetMachineInstanceCount,
  httpsGetDataDrivesByUserName,
  httpsGetMachineInstanceLimit,
  httpsGetMachineInstancesList,
  httpsShutdownMachineInstances,
  httpsStartdownMachineInstances,
  httpsGetMachineInstancesDetail,
  httpsEstimateLaunchCloudPCInstance,
}
