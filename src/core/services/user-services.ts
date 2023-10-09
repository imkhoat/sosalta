import { https } from 'boot/axios'
import { API } from './utils/apis'
import { useAuthStore } from 'src/core/stores/auth'
import { errorHandler } from 'src/core/utils/error-handler'
import {
  GetUserInformationResponse,
  UpdateUserInformationRequest,
  UpdateUserInformationResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ChangePhoneRequest,
  ChangePhoneResponse,
  ChangeEmailRequest,
  ChangeEmailResponse,
  GetEmailCodeRequest,
  GetEmailCodeResponse,
  GetSMSCodeRequest,
  GetSMSCodeResponse,
  GetDeleteUserSMSCodeRequest,
  GetDeleteUserSMSCodeResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  MemberUserResponse,
  FriendUserResponse,
  ShareObjectRequest,
  ShareObjectResponse,
  GetTeamGroupResponse,
  CheckAvailableBalanceResponse,
  GetUserListResponse,
  GetMenusByUserResponse,
  UpdateTrueNameRequest,
  UpdateTrueNameResponse,
  CreateNewMembersRequest,
  CreateNewMembersResponse,
  CheckEmailLimitResponse,
  CheckRegisterLimitResponse,
  CheckEmailLimitRequest,
  GetMemberUserRolesResponse,
  UserInfoResponse,
  UpdateAuthRequest,
  UpdateAuthResponse,
  GetAllocationLimitResponse,
  DeleteRoleResponse,
  CreateNewRoleRequest,
  CreateNewRoleResponse,
  AssignRoleRequest,
  AssignRoleResponse,
  GetMenusByRoleResponse,
  GetAssignedRoleRequest,
  GetAssignedRoleResponse,
  UpdateManagerRoleResponse,
  UpdateManagingUserResponse,
  GetGroupOwnersResponse,
  DeleteTeamResponse,
  CreateNewTeamRequest,
  CreateNewTeamResponse,
  GetTeamDetailResponse,
  GetTeamMembersResponse,
  UpdateTeamMembersRequest,
  UpdateTeamMembersResponse,
  GetTeamUsersResponse,
  GetTeamUserPermissionDetailResponse,
  UpdateTeamUserPermissionRequest,
  UpdateTeamUserPermissionResponse,
  GetTeamGroupListRequest,
  GetTeamMembersRequest,
  GetUserNotificationResponse,
  DeleteNotificationResponse,
  MarkReadAllNotificationResponse,
  UpdateNotificationFlagResponse,
  GetUserPricingResponse,
  SendEmailValidationCodeResponse,
  SendEmailValidationResponse,
  GetOperationLoggingRequest,
  GetOperationLoggingResponse,
} from '../types/services/user-types'
import { RESPONSE_CODE } from './utils/https-code'
import { UserRole } from '../types/user-role-types'
import { ShareFileStatus } from '../types/use-notification-types'

/**
 * Get current loggedin user profile
 */
async function httpsGetUserProfile() {
  try {
    const { saveLoggedinAuthData } = useAuthStore()
    const { data } = await https.get<GetUserInformationResponse>(API.USER.ME)

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      const { bucketName, region, userInfo, userMenus } = data?.data
      saveLoggedinAuthData({
        bucketName,
        region,
        userInfo,
        userMenus,
      })
    }

    return {
      ...data,
      data: {
        userInfo: formatUserInformationResponse(data?.data?.userInfo),
      },
    }
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Update user information
 * @param params
 */
async function httpsUpdateUserInformation(
  params: UpdateUserInformationRequest
) {
  try {
    const { data } = await https.post<UpdateUserInformationResponse>(
      API.USER.UPDATE,
      params
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Change password
 * @param params
 */
async function httpsChangePassword(params: ChangePasswordRequest) {
  try {
    const { data } = await https.post<ChangePasswordResponse>(
      API.USER.CHANGE_PASSWORD,
      params
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Change phone number
 * @param params
 */
async function httpsChangePhone(params: ChangePhoneRequest) {
  try {
    const { data } = await https.post<ChangePhoneResponse>(
      API.USER.CHANGE_PHONE,
      params
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Change email
 * @param params
 */
async function httpsChangeEmail(params: ChangeEmailRequest) {
  try {
    const { data } = await https.post<ChangeEmailResponse>(
      API.USER.CHANGE_EMAIL,
      params
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Request email verification code
 * @param params
 */
async function httpsGetEmailCode(params: GetEmailCodeRequest) {
  try {
    const { data } = await https.post<GetEmailCodeResponse>(
      API.USER.REQUEST_EMAIL_CODE,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Request SMS verification code
 * @param params
 */
async function httpsGetDeleteUserSMSCode(params: GetDeleteUserSMSCodeRequest) {
  try {
    const { data } = await https.post<GetDeleteUserSMSCodeResponse>(
      API.USER.REQUEST_DELETE_USER_SMS_CODE,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Request email verification code
 * @param params
 */
async function httpsGetSMSCode(params: GetSMSCodeRequest) {
  try {
    const { data } = await https.post<GetSMSCodeResponse>(
      API.USER.REQUEST_SMS_CODE,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Delete user
 * @param params
 */
async function httpsDeleteUser(params: DeleteUserRequest) {
  try {
    const { data } = await https.post<DeleteUserResponse>(
      API.USER.DELETE_USER,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCreateNewMembers(params: CreateNewMembersRequest) {
  try {
    const { data } = await https.post<CreateNewMembersResponse>(
      API.USER.CREATE_NEW_MEMBERS,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCheckEmailLimit(params: CheckEmailLimitRequest) {
  try {
    const { data } = await https.post<CheckEmailLimitResponse>(
      API.USER.CHECK_EMAIL_LIMIT,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCheckRegisterLimit() {
  try {
    const { data } = await https.get<CheckRegisterLimitResponse>(
      API.USER.CHECK_REGISTER_LIMIT
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}
// support function
function formatUserInformationResponse(userInfo: UserInfoResponse) {
  const {
    StreetLine1,
    streetLine1,
    StreetLine2,
    streetLine2,
    CityTown,
    cityTown,
    State,
    state,
    Nation,
    nation,
    ZipCode,
    zipCode,
    Company,
    company,
    Department,
    department,
    OfficePhone,
    officePhone,
  } = checkJSONValid(userInfo?.address)
    ? JSON.parse(userInfo?.address)
    : {
        StreetLine1: '',
        streetLine1: '',
        StreetLine2: '',
        streetLine2: '',
        CityTown: '',
        cityTown: '',
        State: '',
        state: '',
        Nation: '',
        nation: '',
        ZipCode: '',
        zipCode: '',
        Company: '',
        company: '',
        Department: '',
        department: '',
        OfficePhone: '',
        officePhone: '',
      }

  const { firstName, lastName } = checkJSONValid(userInfo?.trueName)
    ? JSON.parse(userInfo?.trueName)
    : { firstName: '', lastName: '' }

  return {
    ...userInfo,
    address: {
      streetLine1: StreetLine1 || streetLine1,
      streetLine2: StreetLine2 || streetLine2,
      cityTown: CityTown || cityTown,
      state: State || state,
      nation: Nation || nation,
      zipCode: ZipCode || zipCode,
      company: Company || company,
      department: Department || department,
      officePhone: OfficePhone || officePhone,
    },
    trueName: { firstName, lastName },
  }
}

/**
 * Check JSON valid
 * @param originalString
 */
function checkJSONValid(originalString: string) {
  try {
    if (!originalString) {
      return false
    }
    JSON.parse(originalString)
  } catch (e) {
    return false
  }
  return true
}

/**
 * Get member user
 * @param params
 */
async function httpsGetMemberUsers() {
  try {
    const { data } = await https.get<MemberUserResponse>(
      API.USER.GET_MEMBER_USERS
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Get friend user
 * @param params
 */
async function httpsGetFriendUsers() {
  try {
    const { data } = await https.get<FriendUserResponse>(
      API.USER.GET_FRIEND_USERS
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Get member user
 * @param params
 */
async function httpsShareObject(params: ShareObjectRequest) {
  try {
    const { data } = await https.post<ShareObjectResponse>(
      API.USER.SEND,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetTeamGroupList(payload: GetTeamGroupListRequest) {
  try {
    const { data } = await https.post<GetTeamGroupResponse>(
      API.USER.TEAM_GET_TEAM_LIST,
      { ...payload }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCheckAvailableBalance() {
  try {
    const { data } = await https.get<CheckAvailableBalanceResponse>(
      API.USER.BALANCE_CHECK
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetUserList() {
  try {
    const { data } = await https.get<GetUserListResponse>(
      API.USER.GET_MANAGING_LIST
    )
    const userInfos = data?.data.map((info) => {
      return formatUserInformationResponse(info)
    })
    return { ...data, data: userInfos }
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetMenusByUser(userName: string) {
  try {
    const { data } = await https.post<GetMenusByUserResponse>(
      API.USER.GET_MENUS_BY_USER,
      null,
      {
        params: {
          userName: userName,
        },
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUpdateTrueName(payload: UpdateTrueNameRequest) {
  try {
    const { data } = await https.post<UpdateTrueNameResponse>(
      API.USER.UPDATE_TRUE_NAME,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetMemberUserRoles(
  module: 'member_user' | 'team' | 'project'
) {
  try {
    const { data } = await https.post<GetMemberUserRolesResponse>(
      API.USER.GET_ROLES_LIST,
      null,
      {
        params: { module },
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetAssignedRole(payload: GetAssignedRoleRequest) {
  try {
    const { data } = await https.post<GetAssignedRoleResponse>(
      API.USER.GET_ROLE,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUpdateAuth(payload: UpdateAuthRequest) {
  try {
    const { data } = await https.post<UpdateAuthResponse>(
      API.USER.UPDATE_AUTH,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetAllocationLimit(userName: string) {
  try {
    const { data } = await https.post<GetAllocationLimitResponse>(
      API.USER.GET_ALLOCABLE_LIMITS,
      null,
      {
        params: { userName },
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsDeleteRole(roleId: string | number | undefined) {
  try {
    const { data } = await https.post<DeleteRoleResponse>(
      API.USER.DELETE_ROLE,
      null,
      {
        params: { roleId },
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCreateNewRole(payload: CreateNewRoleRequest) {
  try {
    const { data } = await https.post<CreateNewRoleResponse>(
      API.USER.CREATE_ROLE,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsAssignRole(payload: AssignRoleRequest) {
  try {
    const { data } = await https.post<AssignRoleResponse>(
      API.USER.ASSIGN_ROLE,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetMenusByRole(roleId: number) {
  try {
    const { data } = await https.post<GetMenusByRoleResponse>(
      API.USER.GET_MENUS_BY_ROLE,
      null,
      {
        params: { roleId },
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetTeamMenusByRole(roleId: number) {
  try {
    const { data } = await https.post<GetMenusByRoleResponse>(
      API.USER.GET_MENUS_BY_ROLE,
      null,
      {
        params: { roleId },
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUpdateManagerRole(value: UserRole, userName: string) {
  try {
    const { data } = await https.post<UpdateManagerRoleResponse>(
      API.USER.UPDATE_MANAGER_ROLE,
      null,
      {
        params: { value, userName },
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUpdateManagingUser(payload: {
  users: string[]
  userName: string
}) {
  try {
    const { data } = await https.post<UpdateManagingUserResponse>(
      API.USER.UPDATE_MANAGING_USERS,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetGroupOwners() {
  try {
    const { data } = await https.post<GetGroupOwnersResponse>(
      API.USER.TEAM_OWNER_LIST
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsDeleteTeams(payload: string[]) {
  try {
    const { data } = await https.post<DeleteTeamResponse>(
      API.USER.TEAM_DELETE_TEAMS,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCreateNewTeam(payload: CreateNewTeamRequest) {
  try {
    const { data } = await https.post<CreateNewTeamResponse>(
      API.USER.TEAM_CREATE_TEAM,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetTeamDetail(groupId: string) {
  try {
    const { data } = await https.get<GetTeamDetailResponse>(
      `${API.USER.TEAM_GET_TEAM_DETAIL}/${groupId}`
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsChangeTeamName(groupId: string, groupName: string) {
  try {
    const { data } = await https.post<GetTeamDetailResponse>(
      API.USER.TEAM_CHANGE_TEAM_NAME,
      null,
      {
        params: { groupId, groupName },
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetTeamMembers(payload: GetTeamMembersRequest) {
  try {
    const { data } = await https.post<GetTeamMembersResponse>(
      API.USER.TEAM_GET_TEAM_MEMBERS,
      null,
      {
        params: payload,
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUpdateTeamMembers(payload: UpdateTeamMembersRequest) {
  try {
    const { data } = await https.post<UpdateTeamMembersResponse>(
      API.USER.TEAM_UPDATE_TEAM_MEMBERS,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetTeamUsers(groupId: string) {
  try {
    const { data } = await https.post<GetTeamUsersResponse>(
      API.USER.TEAM_GET_TEAM_USERLIST,
      null,
      {
        params: { groupId },
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetTeamUserPermissionDetail(
  groupId: string,
  userName: string
) {
  try {
    const payload = {
      groupId,
      userName,
    }
    const { data } = await https.post<GetTeamUserPermissionDetailResponse>(
      API.USER.TEAM_GET_TEAM_USER_PERMISSION_DETAIL,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUpdateTeamUserPermission(
  payload: UpdateTeamUserPermissionRequest
) {
  try {
    const { data } = await https.post<UpdateTeamUserPermissionResponse>(
      API.USER.TEAM_UPDATE_TEAM_USER_PERMISSION,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetUserNotifications(payload: {
  event: 'all' | 'read' | 'unRead'
  limit: number
}) {
  try {
    const { data } = await https.post<GetUserNotificationResponse>(
      API.USER.NOTIFICATION_GET_MESSAGES,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsDeleteNotifications(payload: string[]) {
  try {
    const { data } = await https.post<DeleteNotificationResponse>(
      API.USER.DELETE_NOTIFICATIONS,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsMarkReadAllNotifications(payload: string[]) {
  try {
    const { data } = await https.post<MarkReadAllNotificationResponse>(
      API.USER.MARK_NOTIFICATION_AS_READ,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUpdateNotificationFlag(payload: {
  msgId: string
  status?: ShareFileStatus
}) {
  try {
    const { data } = await https.post<UpdateNotificationFlagResponse>(
      API.USER.UPDATE_NOTIFICATION_FLAG,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetUserPricing() {
  try {
    const { data } = await https.get<GetUserPricingResponse>(API.USER.PRICINGS)
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsSendEmailValidationCode(payload: {
  captchaCode: string
  captchauuid: string
  email: string
}) {
  try {
    const { data } = await https.post<SendEmailValidationCodeResponse>(
      API.USER.SEND_EMAIL_VALIDATION_CODE,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsSendEmailValidation(payload: {
  emailCode: string
  email: string
}) {
  try {
    const { data } = await https.post<SendEmailValidationResponse>(
      API.USER.SEND_EMAIL_VALIDATION,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetOperationLogging(payload: GetOperationLoggingRequest) {
  try {
    const { data } = await https.post<GetOperationLoggingResponse>(
      API.USER.OPERATION_LOG_GET_USER_OPERATION_LOGGING,
      null,
      {
        params: payload,
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

export {
  httpsDeleteRole,
  httpsUpdateAuth,
  httpsDeleteUser,
  httpsGetSMSCode,
  httpsAssignRole,
  httpsGetUserList,
  httpsChangeEmail,
  httpsChangePhone,
  httpsShareObject,
  httpsDeleteTeams,
  httpsGetTeamUsers,
  httpsGetEmailCode,
  httpsCreateNewTeam,
  httpsGetTeamDetail,
  httpsCreateNewRole,
  httpsGetUserPricing,
  httpsGetTeamMembers,
  httpsUpdateTrueName,
  httpsGetMemberUsers,
  httpsGetFriendUsers,
  httpsGetUserProfile,
  httpsChangePassword,
  httpsGetMenusByUser,
  httpsGetMenusByRole,
  httpsChangeTeamName,
  httpsGetGroupOwners,
  httpsGetAssignedRole,
  httpsCheckEmailLimit,
  httpsGetTeamGroupList,
  httpsCreateNewMembers,
  httpsUpdateManagerRole,
  httpsUpdateTeamMembers,
  httpsGetAllocationLimit,
  httpsCheckRegisterLimit,
  httpsGetTeamMenusByRole,
  httpsGetMemberUserRoles,
  httpsUpdateManagingUser,
  httpsGetOperationLogging,
  httpsSendEmailValidation,
  httpsDeleteNotifications,
  httpsGetUserNotifications,
  httpsGetDeleteUserSMSCode,
  httpsCheckAvailableBalance,
  httpsUpdateUserInformation,
  httpsUpdateNotificationFlag,
  httpsSendEmailValidationCode,
  httpsUpdateTeamUserPermission,
  httpsMarkReadAllNotifications,
  httpsGetTeamUserPermissionDetail,
}
