import { https } from 'boot/axios'
import { API } from './utils/apis'
import {
  GetSmsCodeRequest,
  GetSmsCodeResponse,
  RegisterRequest,
  RegisterResponse,
  CheckUserNameRequest,
  CheckUserNameResponse,
  CheckPhoneNumberRequest,
  CheckPhoneNumberResponse,
  LoginRequest,
  LoginResponse,
  FindPasswordByEmailRequest,
  FindPasswordByEmailResponse,
  FindPasswordByPhoneRequest,
  FindPasswordByPhoneResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  EmailExpiredRequest,
  EmailExpiredResponse,
} from '../types/services/auth-types'
import { errorHandler } from 'src/core/utils/error-handler'

/**
 * Register new account
 * @param params
 */
async function httpsRegister(params: RegisterRequest) {
  try {
    const { data } = await https.post<RegisterResponse>(API.AUTH.SIGNUP, params)

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Request SMS verification code
 * @param params
 */
async function httpsGetSMSCode(params: GetSmsCodeRequest) {
  try {
    const { data } = await https.post<GetSmsCodeResponse>(
      API.AUTH.REQUEST_SMS_CODE,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Checking user exist?
 * @param params
 */
async function httpsCheckUserName(params: CheckUserNameRequest) {
  try {
    const { data } = await https.post<CheckUserNameResponse>(
      API.AUTH.CHECK_USER,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Checking phone number
 * @param params
 */
async function httpsCheckPhoneNumber(params: CheckPhoneNumberRequest) {
  try {
    const { data } = await https.post<CheckPhoneNumberResponse>(
      API.AUTH.CHECK_PHONE,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Checking email expired
 * @param params
 */
async function httpsCheckingEmailExpire(params: EmailExpiredRequest) {
  try {
    const { data } = await https.post<EmailExpiredResponse>(
      API.AUTH.EMAIL_EXPIRE,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Login to AtlasOS with username/email
 * @param params
 */
async function httpsLogin(params: LoginRequest) {
  try {
    const { data } = await https.post<LoginResponse>(API.AUTH.LOGIN, params)

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Find password by email
 * @param params
 */
async function httpsFindPasswordByEmail(params: FindPasswordByEmailRequest) {
  try {
    const { data } = await https.post<FindPasswordByEmailResponse>(
      API.AUTH.FIND_PASSWORD_BY_EMAIL,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Find password by phone
 * @param params
 */
async function httpsFindPasswordByPhone(params: FindPasswordByPhoneRequest) {
  try {
    const { data } = await https.post<FindPasswordByPhoneResponse>(
      API.AUTH.FIND_PASSWORD_BY_PHONE,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Reset password
 * @param params
 */
async function httpsResetPassword(params: ResetPasswordRequest) {
  try {
    const { data } = await https.post<ResetPasswordResponse>(
      API.AUTH.RESET_PASSWORD,
      params
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

export {
  httpsLogin,
  httpsRegister,
  httpsGetSMSCode,
  httpsCheckUserName,
  httpsCheckPhoneNumber,
  httpsCheckingEmailExpire,
  httpsResetPassword,
  httpsFindPasswordByEmail,
  httpsFindPasswordByPhone,
}
