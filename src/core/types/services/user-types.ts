import { UserInfo } from 'src/core/types/user-info'
import { UserMenu } from 'src/core/types/user-menu'
import { HttpsResponse } from './https-response'
import { Pagging } from 'src/core/types/pagging-types'
import { Team } from 'src/core/types/team-types'
import { PermissionRole, PermissionRoleType } from '../permission-role-types'
import { PermissionCodeType } from '../permission-code-types'
import { AllocationLimits } from '../allocation-limit-types'
import { TeamMember } from '../team-member-types'
import { UserNotification } from '../use-notification-types'
import { UserPricing } from '../user-pricing-types'
import { OperationLogging } from '../operation-logging-types'
export interface UserInfoResponse extends Omit<UserInfo, 'trueName'> {
  address: string
  trueName: string
}

interface GetTeamMembersData extends Pagging {
  errorMsg?: string
  list: TeamMember[]
}

export interface FriendUser {
  friend: string
  headImageS3Key: string
  lastMessage: string
  msgTime: string | Date
  msgType: string
  nickName: null
  numberOfUnRead: 0
  timeStamp: string | Date
  userName: string
}

export interface MemberUser {
  active: boolean
  address: string
  cellingCode: string
  createdAt: string | Date
  deleteStatus: string
  developers: string
  email: string
  emailCertification: string
  fileSystemIV: string
  fileSystemIVAES: string
  fileSystemKey: string
  gmtCreate: string | Date
  gmtUpdate: string | Date
  headImageS3Key: string
  keyLibIV: string
  keyLibIVAES: string
  keyLibKey: string
  manager: string
  masterKeySalt: string
  masterKeySaltForFile: string
  memberManagerList: string | string[] | ['all']
  password: string
  phoneNumber: string
  roleName: 'memberManager'
  trueName: string
  userName: string
  userState: 1
}

export interface Message {
  receiverFlag: string | null
  title: string
  shareFileStatus: string
  content: string
  flag: false
  receiver: string
  createdTime: string | Date
  type: 'share'
  id: string
  sender: {
    userName: string
    trueName: string
  }
}

export interface UpdateUserInformationRequest extends Partial<UserInfo> {
  address: string
  trueName: string
}

export interface GetTeamMembersRequest {
  limit?: number
  page?: number
  groupId?: string
  userName?: string
}

export interface UpdateUserInformationResponse extends HttpsResponse {
  data: {
    errorMsg?: string
  }
}

export interface GetUserInformationResponse extends HttpsResponse {
  data: {
    errorMsg?: string
    userInfo: UserInfoResponse
    userMenus: UserMenu[]
    bucketName: string
    region: string
  }
}

export interface ChangePasswordRequest {
  newPassword: string
  oldPassword: string
}
export interface ChangePasswordResponse extends HttpsResponse {
  data: {
    errorMsg?: string
    userInfo?: UserInfoResponse
  }
}

export interface ChangePhoneRequest {
  password: string
  phone: string
  cellingCode: string
  phoneCode: string
  oldPhone: string
}
export interface ChangePhoneResponse extends HttpsResponse {
  data: {
    errorMsg?: string
    userInfo?: UserInfoResponse
  }
}
export interface ChangeEmailRequest {
  email: string | undefined
  password: string | undefined
  oldEmail: string | undefined
  emailCode: string | undefined
}
export interface ChangeEmailResponse extends HttpsResponse {
  data: {
    errorMsg?: string
    userInfo?: UserInfoResponse
  }
}

export interface GetEmailCodeRequest {
  email: string
  captchaCode: string
  captchauuid: string
}

export interface GetEmailCodeResponse extends HttpsResponse {
  optionalData: {
    smsCode: string
  }
}

export interface GetSMSCodeRequest {
  cellingCode: string
  captchaCode: string
  captchauuid: string
  phone: string
}

export interface GetSMSCodeResponse extends HttpsResponse {
  optionalData: {
    smsCode: string
  }
}

export interface GetDeleteUserSMSCodeRequest {
  cellingCode: string
  phoneNumber: string
  type: 'deleteUser'
  userName: string
  captchaCode: string
  captchauuid: string
}

export interface GetDeleteUserSMSCodeResponse extends HttpsResponse {
  optionalData: {
    smsCode: string
  }
}

export interface DeleteUserRequest {
  email: string
  password: string
  smsCode: string
  trueName: string
  userName: string | undefined
}

export interface DeleteUserResponse extends HttpsResponse {
  optionalData: {
    smsCode: string
  }
}

export interface MemberUserResponse extends HttpsResponse {
  data: MemberUser[]
}

export interface FriendUserResponse extends HttpsResponse {
  data: FriendUser[]
}

export interface ShareObjectRequest {
  contents: {
    fileId?: string | undefined
    fileName?: string | undefined
    fileSize?: string | number | undefined
    registerContent?: string
  }[]
  receivers: string[]
  type: 'share'
  sender: {
    userName: string
    trueName: string
  }
}

export interface ShareObjectResponse extends HttpsResponse {
  data: Message[]
}

interface GetTeamGroupData extends Pagging {
  errorMsg?: string
  list: Team[]
}
export interface GetTeamGroupResponse extends HttpsResponse {
  data: GetTeamGroupData
}

export interface GetTeamGroupListRequest {
  page?: number
  limit?: number
  search?: string
  owner?: string
}

export interface CheckAvailableBalanceResponse extends HttpsResponse {
  data: string | undefined
}

export interface GetUserListResponse extends HttpsResponse {
  data: UserInfoResponse[]
}

export interface GetMenusByUserResponse extends HttpsResponse {
  data: UserMenu[]
}

export interface UpdateTrueNameRequest {
  trueName: string
  userName: string
}
export interface UpdateTrueNameResponse extends HttpsResponse {
  data: UserInfoResponse
}

export interface CreateNewMembersRequest {
  event: 'register'
  emails: string[]
  userName: string
}

export interface CreateNewMembersResponse extends HttpsResponse {
  data: UserInfoResponse
}

export interface CheckRegisterLimitResponse extends HttpsResponse {
  data: {
    current: number
    limit: number
  }
}

export interface CheckEmailLimitResponse extends HttpsResponse {
  data: string
}

export interface CheckEmailLimitRequest {
  event: 'register'
  email: string
}

export interface GetMemberUserRolesResponse extends HttpsResponse {
  data: PermissionRole[]
}

export interface UpdateAuthRequest {
  trees: {
    menuId: number | string | undefined
    type: number | string | undefined | PermissionCodeType
    value: number | string | boolean | undefined
  }[]
  userNames: string[]
}

export interface UpdateAuthResponse extends HttpsResponse {
  data: string
}

export interface GetAllocationLimitResponse extends HttpsResponse {
  data: AllocationLimits
}
export interface DeleteRoleResponse extends HttpsResponse {
  data: string
}

export interface CreateNewRoleRequest {
  menus: {
    menuId: string | number | undefined
    value: string | number | undefined
  }[]
  module: 'member_user' | 'team' | 'project'
  roleId: string | number | undefined
  roleName: string
}

export interface CreateNewRoleResponse extends HttpsResponse {
  data: string
}

export interface AssignRoleRequest {
  roleId: number | string | null
  module: 'member_user' | 'team' | 'project'
  moduleItem: string | number
  users: string[]
}

export interface AssignRoleResponse extends HttpsResponse {
  data: any
}

export interface GetMenusByRoleResponse extends HttpsResponse {
  data: UserMenu[]
}

export interface GetAssignedRoleRequest {
  module: 'member_user' | 'team' | 'project'
  moduleItem: string
  userName: string
}
export interface GetAssignedRoleResponse extends HttpsResponse {
  data: {
    id: string | number
    module: 'member_user' | 'team' | 'project'
    owner: string | number
    type: PermissionRoleType
    status: string | number
    roleName: string
    gmtCreate: string | number | Date
    gmtUpdate: string | number | Date
  }
}

export interface UpdateManagerRoleResponse extends HttpsResponse {
  data: UserInfo
}
export interface UpdateManagingUserResponse extends HttpsResponse {
  data: UserInfo
}

export interface GetGroupOwnersResponse extends HttpsResponse {
  data: string[]
}

export interface DeleteTeamResponse extends HttpsResponse {
  data: string
}

export interface CreateNewTeamRequest {
  groupName: string
  userNameItem: {
    userName: string
    trueName: string
  }
}

export interface CreateNewTeamResponse extends HttpsResponse {
  data: Team
}

export interface GetTeamDetailResponse extends HttpsResponse {
  data: {
    groupNameItem: Team
  }
}

export interface GetTeamMembersResponse extends HttpsResponse {
  data: TeamMember[]
}

export interface UpdateTeamMembersRequest {
  addGroupUsers: TeamMember[] | UserInfo[]
  deleteGroupUsers: TeamMember[] | UserInfo[]
  updateGroupUsers: TeamMember[] | UserInfo[]
  groupId: string
}

export interface UpdateTeamMembersResponse extends HttpsResponse {
  data: string
}

export interface GetTeamUsersResponse extends HttpsResponse {
  data: UserInfo[]
}

export interface GetTeamUserPermissionDetailResponse extends HttpsResponse {
  data: UserMenu[]
}

export interface UpdateTeamUserPermissionRequest {
  groupAuths: {
    groupId: string
    userName: string
    managerUser: boolean
    auth?: string
  }[]
}

export interface UpdateTeamUserPermissionResponse extends HttpsResponse {
  data: string
}

export interface GetUserNotificationResponse extends HttpsResponse {
  data: {
    items: UserNotification[]
    lastEvaluatedFlagMessage?: string
    lastEvaluatedMessage?: string
  }
}

export interface DeleteNotificationResponse extends HttpsResponse {
  data: string
}

export interface MarkReadAllNotificationResponse extends HttpsResponse {
  data: string
}

export interface UpdateNotificationFlagResponse extends HttpsResponse {
  data: string
}

export interface GetUserPricingResponse extends HttpsResponse {
  data: {
    C: UserPricing[]
    D: UserPricing[]
    E: UserPricing[]
    G: UserPricing[]
    M: UserPricing[]
    O: UserPricing[]
    P: UserPricing[]
  }
}

export interface SendEmailValidationCodeResponse extends HttpsResponse {
  data: string
}

export interface SendEmailValidationResponse extends HttpsResponse {
  data: string
}

export interface GetOperationLoggingRequest {
  userName?: string
  keyword?: string
  fromDate?: string
  toDate?: string
  page?: number
  lastEvaluatedUserLog?: number
  limit?: number
}

export interface GetOperationLoggingData extends Pagging {
  list: OperationLogging[]
}
export interface GetOperationLoggingResponse extends HttpsResponse {
  data: GetOperationLoggingData
}
