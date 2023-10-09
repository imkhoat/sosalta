import { UserRole } from './user-role-types'

export interface UserInfo {
  active: boolean
  address: Address | string
  cellingCode: string
  createdAt: string
  deleteStatus: string | boolean
  developers: string | boolean
  email: string
  emailCertification: string | boolean
  fileSystemIV: string
  fileSystemIVAES: string
  fileSystemKey: string
  gmtCreate: string | number
  gmtUpdate: string | number
  headImageS3Key: string
  keyLibIV: string
  keyLibIVAES: string
  keyLibKey: string
  manager: string
  masterKeySalt: string
  masterKeySaltForFile: string
  memberManagerList: string[] | ['all']
  password: string
  phoneNumber: string
  roleName: UserRole
  trueName: TrueName
  userName: string
  userState: 1 | 0
  roleNameString?: string
  gmtCreateAtString?: string
}

export interface Address {
  streetLine1: string
  streetLine2: string
  cityTown: string
  state: string
  nation: string
  zipCode: string
  company: string
  department: string
  officePhone: string
}

export interface TrueName {
  firstName: string
  lastName: string
}
