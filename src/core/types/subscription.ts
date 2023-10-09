export interface Subscription {
  discountAnnuallyPrice: string | number
  discountMonthPrice: string | number
  hardDiskSize: string | number
  maxAllowedUnpaidFee: string | number
  maxAnalysisAppsNumber: string | number
  maxCloudpcHourlyCharge: string | number
  maxCloudpcsNumber: string | number
  maxMemberAccountNumber: string | number
  maxStorageCapacity: string | number
  mcMemberInfoId: string | number
  monthPrice: string | number
  serviceCharge: string | number
  support: string | number
  typeNote: string | number
  subscriptionPackages?: SubscriptionPack[]
}

export interface SubscriptionPack {
  day: string | number
  name: string | number
  value: string | number
  id: string | number
  memberInfoType: string | number
  originPrice: string | number
  price: string | number
  totalDay: string | number
  type: 'MONTHLY' | 'YEARLY'
  typeFlag: string | number
}
