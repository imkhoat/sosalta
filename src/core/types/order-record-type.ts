export interface OrderRecord {
  authLimit: AuthLimit
  discountAnnuallyPrice: number
  discountMonthPrice: number
  expireDateOfDay: number
  expireTime: string
  mcMemberOrderRecordId: number
  memberInfoId: number
  monthPrice: number
  roleName: string
  startTime: string
  status: number
  userDataVo: UserDataVo
  username: string
}

export interface AuthLimit {
  allowManualShutdownOption: number
  hardDiskSize: number
  hardDiskSizeUnit: string
  maxAllowedUnpaidFee: number
  maxAnalysisAppsNumber: number
  maxCloudpcHourlyCharge: number
  maxCloudpcHourlyChargeUnit: string
  maxCloudpcsNumber: number
  maxMemberAccountNumber: number
  maxStorageCapacity: number
  maxStorageCapacityUnit: string
  serviceCharge: number
  support: string
  type: number
  typeNote: string
}

export interface UserDataVo {
  subUsers: number
  userDataDriverCapacity: number
  userDeveloperCenterCapacity: number
  userGroupCapacity: number
  userProjectCapacity: number
  userStorageCapacity: number
}

export interface userSubscription {
  type: number
  typeNote: string
  expireDateOfDay: number
  expireTime: string
  startTime: string
  status: number
}
