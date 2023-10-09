export interface MachineInstanceType {
  id: number
  cpu: number
  version: number
  memory: number
  type: string
  price: number
  useGpu: boolean
}

export interface MachineServerError {
  hardware: string | undefined
  dataDriveLimit: string | undefined
  systemDriveLimit: string | undefined
  autoShutdown: string | undefined
  autoShutdownDuration: string | undefined
  active: string | undefined
  unpaidBill: string | undefined
}

export interface MachineInstance {
  machineInstanceId: number
  status: MachineInstanceStatus
  instanceName: string
  createdBy: string
  startTime: number
  endTime: number
  duration: string
  runningDuration: number
  timingShutdown: boolean
  shutdownType: 'AUTO_SHUTDOWN' | 'MANUAL_SHUTDOWN'
  pausedReason: string
  autoShutdownTime: number
  downloadDataDriveFee: number
  uploadDataDriveFee: number
  ebsFee: number
  instanceFeeParts: string
  instanceTransferFeeParts: string
  totalCost: number
  machineStatusMetadata: {
    originalStatusCode: number
    type: MachineInstanceStatusTypes
    codeLabel: string
    displayLabel: string
    description: string
    shortDescription: string
  }
}

export interface MachineInstanceDetail {
  machineInstanceId: string
  instanceId: string
  type: string
  instanceName: string
  createdBy: string
  startTimeString?: string
  username: string
  password: string
  status: MachineInstanceStatus
  amiId: string
  imageName: string
  imageSize: number
  imageInformation: string
  rootDriveSize: number
  dataDriveSize: number
  dataDriveId: string
  driveName: string
  config: {
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
  startTime: string
  endTime: string
  endTimeString?: string
  hostName: string
  publicIp: string
  runStatus: string
  errorMsg: string
  attachStatus: string
  attachMsg: string
  platform: string
  machineCostInfoVO: {
    ec2s: {
      name: string
      seconds: number
      price: number
    }[]
    storage: {
      name: string
      seconds: number
      price: number
    }
    outBound: {
      quantity: number
      price: number
    }
  }
  totalRunningTime: number
  totalCost: number
  duration: string
  runningDuration: string
  timingShutdown: boolean
  shutdownType: 'AUTO_SHUTDOWN' | 'MANUAL_SHUTDOWN'
  pausedReason: string
  autoShutdownTime: string
  machineStatusMetadata: {
    originalStatusCode: number
    type: MachineInstanceStatusTypes
    codeLabel: string
    displayLabel: string
    description: string
    shortDescription: string
  }
}
/**
 * FAILED_TO_CLEAR(-1,"failedToClear","Failed but cleared"),
    FAILURE(0, "failure", "Failed to start"),
    STARTING(1, "starting", "Starting"),
    RUNNING(2, "running", "Running"),
    SHUTDOWN(3, "shutdown", "Shutdown"),
    WAITING_IN_QUEUE(4, "waitingInQueue", "Waiting In Queue"),
    CANCEL(5, "cancel", "Cancel"),
    SHUTTING_DOWN(6, "shuttingDown", "Shutting down"),
    PAUSING(7, "pausing", "Pausing"),
    PAUSED(8, "paused", "Paused"),
    RESUMING(9, "resuming", "Resuming"),
    HAND_SHUTTING_DOWN(10, "handShuttingDown", "Manual Shutdown");
 */
export enum MACHINE_INSTANCE_STATUS {
  FAILED_TO_CLEAR = -1,
  FAILURE = 0,
  STARTING = 1,
  RUNNING = 2,
  SHUTDOWN = 3,
  WAITING_IN_QUEUE = 4,
  CANCEL = 5,
  SHUTTING_DOWN = 6,
  PAUSING = 7,
  PAUSED = 8,
  RESUMING = 9,
  HAND_SHUTTING_DOWN = 10,
}

export type MachineInstanceStatus =
  | -1
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10

export enum MACHINE_INSTANCE_STATUS_TYPES {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
  SUSPENDED = 'SUSPENDED',
}

export type MachineInstanceStatusTypes = `${MACHINE_INSTANCE_STATUS_TYPES}`
