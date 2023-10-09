import { BitUnit } from './unit-type'

export interface UserStorage {
  currentUserStorageUsed: number
  availableToUseForAll: number
  mainUserMaxStorageLimit: number
  availableToAllocate: number
  storageValueUnit: BitUnit
  currentUserStorageLimit: number
  availableToUseForCurrentUser: number
  userName: string
  memberUsersAllocatedStorage: number
}
