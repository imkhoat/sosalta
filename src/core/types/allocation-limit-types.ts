export interface AllocationLimits {
  type: string
  typeNote: string
  maxMemberAccountNumber: number | string
  maxAnalysisAppsNumber: number | string
  maxCloudpcsNumber: number | string
  maxStorageCapacity: number | string
  maxCloudpcHourlyCharge: number | string
  maxAllowedUnpaidFee: number | string
  support: string
  serviceCharge: number | string
  hardDiskSize: number | string
  allowManualShutdownOption: number | string
  hardDiskSizeUnit: string
  maxCloudpcHourlyChargeUnit: string
  maxStorageCapacityUnit: string
}
