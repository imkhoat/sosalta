import { HttpsResponse } from './https-response'
import { UserInfo } from 'src/core/types/user-info'
import { UserMenu } from 'src/core/types/user-menu'
export type LOGIN_TYPE = 'PHONE' | 'EMAIL' | 'USERNAME'

export const LOGIN_OPTION = {
  PHONE: 'PHONE' as LOGIN_TYPE,
  EMAIL: 'EMAIL' as LOGIN_TYPE,
  USERNAME: 'USERNAME' as LOGIN_TYPE,
}

export interface GetSmsCodeRequest {
  cellingCode: string
  phoneNumber: string
  type:
    | 'register'
    | 'login'
    | 'findPassword'
    | 'deleteUser'
    | 'updatePhone'
    | 'change_phone'
  userName: string
  captchaCode: string
  captchauuid: string
}

export interface GetSmsCodeResponse extends HttpsResponse {
  optionalData: {
    smsCode: string
  }
}

export interface RegisterRequest {
  accessCode?: string
  accessCodeFlag: boolean
  captchaCode: string
  captchauuid: string
  smsCode: string
  style: 'register' | 'login'
  userItem: {
    cellingCode: string
    confirmPassword: string
    email: string
    password: string
    phoneNumber: string
    userName: string
  }
}

export interface RegisterResponse extends HttpsResponse {
  data: {
    errorMsg?: string
  }
}

export interface CheckUserNameRequest {
  userName: string
}

export interface CheckUserNameResponse extends HttpsResponse {
  data: {
    errorMsg?: string
  }
}

export interface CheckPhoneNumberRequest {
  cellingCode: string
  phoneNumber: string
  style:
    | 'register'
    | 'login'
    | 'findPassword'
    | 'deleteUser'
    | 'updatePhone'
    | 'change_phone'
  userName: string
  captchaCode?: string
  captchauuid?: string
}

export interface CheckPhoneNumberResponse extends HttpsResponse {
  data: {
    errorMsg?: string
  }
}

export interface LoginRequest {
  captchaCode: string
  captchauuid: string
  loginStyle: 'userNameLogin' | 'phoneNumberLogin'
  userItem?: {
    userName: string
    password: string
  }
  smsCodeItem?: {
    cellingCode: string
    phoneNumber: string
    sms: string
    type: 'login' | 'register'
    userName: string
  }
}

export interface LoginResponse extends HttpsResponse {
  data: {
    errorMsg?: string
    userInfo: UserInfo
    userMenus: UserMenu[]
    bucketName: string
    region: string
  }
}

export interface FindPasswordByEmailRequest {
  emails: string[]
  userName: string
  event: string
}

export interface FindPasswordByEmailResponse extends HttpsResponse {
  data: {
    errorMsg?: string
  }
}

export interface FindPasswordByPhoneRequest {
  sms: string
  phoneNumber: string
  userName: string
  type: string
  cellingCode: string
}

export interface FindPasswordByPhoneResponse extends HttpsResponse {
  data: {
    code?: string
    key?: string
    phoneEmail?: string
    userName?: string
  }
}

export interface ResetPasswordRequest {
  userName: string
  phoneEmail: string
  password: string
  key: string
  code: string
  accessCode?: string
}

export interface ResetPasswordResponse extends HttpsResponse {
  data: {
    errorMsg?: string
  }
}

export interface EmailExpiredRequest {
  accessCode: string
  email: string
  event: string
  userName: string
}

export interface EmailExpiredResponse extends HttpsResponse {
  data: {
    userName: string
    phoneEmail: string
    password: string | null
    code: string
    key: string
  }
}
