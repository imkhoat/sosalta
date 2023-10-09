export interface OperationLogging {
  userLogId: string
  userName: string
  timeStamp: string | number | Date
  logType: OperationLoggingType
  actionString: string
  operationUser: string
  ip: string
  browserName: string
  browserCore: string
  os: string
  userAgent: string
}

export enum OPERATION_LOG_TYPE {
  USERLOG = 'USERLOG',
}
export type OperationLoggingType = `${OPERATION_LOG_TYPE}`
