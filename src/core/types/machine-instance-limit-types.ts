export interface MachineInstanceLimit {
  type: number
  typeNote: string
  maxMemberAccountNumber: number
  maxAnalysisAppsNumber: number
  maxCloudpcsNumber: number
  maxStorageCapacity: number
  maxCloudpcHourlyCharge: number
  maxAllowedUnpaidFee: number
  support: number
  serviceCharge: number
  hardDiskSize: number
  allowManualShutdownOption: number
  hardDiskSizeUnit: string
  maxCloudpcHourlyChargeUnit: string
  maxStorageCapacityUnit: string
}
