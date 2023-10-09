import { Pagging } from '../pagging-types'
import { PaymentDetailData } from '../payment-detail-data-types'
import { PaymentHistory } from '../payment-history-types'
import { HttpsResponse } from './https-response'

export interface PayWithBalanceRequest {
  memberOrder: {
    memberInfoId: number | string | undefined
    expireDateOfDay: number | string
  }
}
export interface PayWithBalanceResponse extends HttpsResponse {
  data: {
    errorMsg?: string
  }
}

export interface CreateStripePaymentIntentRequest {
  amount: number | string
  captchaCode: number | string
  captchauuid: number | string
  currency: 'usd'
  memberOrder?: string
  subject?: string
}
export interface CreateStripePaymentIntentResponse extends HttpsResponse {
  data: {
    errorMsg?: string
    publishableKey?: string
    clientSecret?: string
  }
}

export interface CreateAmazonOrderRequest {
  amount: number | string
  amazonOrderReferenceId: string
}
export interface CreateAmazonOrderResponse extends HttpsResponse {
  data: {
    errorMsg?: string
    publishableKey?: string
    clientSecret?: string
  }
}

export interface CreateAmazonConfirmPaymentRequest {
  amazonOrderReferenceId: string
}
export interface CreateAmazonConfirmPaymentResponse extends HttpsResponse {
  data: {
    errorMsg?: string
    publishableKey?: string
    clientSecret?: string
  }
}

export interface CreateAmazonCheckoutSessionRequest {
  captcha: {
    captchauuid: string
    captchaCode: string
  }
  amount: string | number
  webCheckoutDetails: {
    checkoutReviewReturnUrl: string
    checkoutResultReturnUrl: string
  }
  customInformation: string
  paymentType: 'MEMBER_ORDER' | 'ADD_FUNDS'
}

export interface AmazonCheckoutSession {
  checkoutSessionId: string
  webCheckoutDetails: {
    checkoutReviewReturnUrl: string
    checkoutResultReturnUrl: string
    amazonPayRedirectUrl: string
    checkoutCancelUrl: string
  }
  productType: string
  paymentDetails: {
    paymentIntent: string
    canHandlePendingAuthorization: boolean
    chargeAmount: string
    totalOrderAmount: string
    softDescriptor: string
    presentmentCurrency: string
    allowOvercharge: string | boolean
    extendExpiration: string | boolean
  }
  chargePermissionType: 'OneTime'
  orderType: string
  recurringMetadata: string
  paymentMethodOnFileMetadata: string
  merchantMetadata: {
    merchantReferenceId: string
    merchantStoreName: string
    noteToBuyer: string
    customInformation: string
  }
  supplementaryData: string
  buyer: string
  billingAddress: string
  paymentPreferences: [string]
  statusDetails: {
    state: 'Open'
    reasonCode: string
    reasonDescription: string
    lastUpdatedTimestamp: string | Date
  }
  shippingAddress: string
  platformId: string
  chargePermissionId: string
  chargeId: string
  constraints: { constraintId: string; description: string }[]
  creationTimestamp: string | Date
  expirationTimestamp: string | Date
  storeId: string
  providerMetadata: {
    providerReferenceId: string
  }
  releaseEnvironment: 'Sandbox' | 'Live'
  deliverySpecifications: string
}

export interface CreateAmazonCheckoutSessionResponse extends HttpsResponse {
  data: {
    amazonPayInfo: {
      amazonPayMerchantId?: string
      amazonPublicKeyId?: string
    }
    payload: AmazonCheckoutSession
    signature: string
    checkoutSessionId: string
  }
}

export interface GetAmazonCheckoutSessionResponse extends HttpsResponse {
  data: AmazonCheckoutSession
}

export interface GetAmazonCheckoutButtonSignatureResponse
  extends HttpsResponse {
  data: {
    signature: string
    payloadJSON: string
  }
}

export interface AmazonCompletedOrderRequest {
  checkoutSessionId: string
  amount: string | number
}
export interface AmazonCompletedOrderResponse extends HttpsResponse {
  data: any
}

export interface AmazonUpdatePaymentInformationRequest {
  checkoutSessionId: string
  webCheckoutDetails: {
    checkoutResultReturnUrl: string
  }
  paymentDetails: {
    paymentIntent: 'AuthorizeWithCapture'
    chargeAmount: {
      amount: string
      currencyCode: 'USD'
    }
  }
  merchantMetadata?: {
    merchantReferenceId: string
    merchantStoreName: string
    noteToBuyer: string
    customInformation: string
  }
}

export interface GetTotalCoinAmountResponse extends HttpsResponse {
  data: number | string
}

export interface Balance {
  userName: string
  balance: number
  version: string
  limitOfArrears: number
  countOfArrears: number
  coinsAmount: number
  totalUnpaidMinusAllowed: number
  totalUnpaid: number
  totalCost: number
  status: string
}

interface PaymentHistoryData extends Pagging {
  list: PaymentHistory[]
}

export interface GetTotalBalanceResponse extends HttpsResponse {
  data: Balance
}

export interface GetBilledTotalResponse extends HttpsResponse {
  sumWaitPayFee: string | number
  totalUnpaid: string | number
}

export interface GetPaymentHistoryResponse extends HttpsResponse {
  data: PaymentHistoryData
}
export interface GetPaymentHistoryRequest {
  keyword?: string
  page?: number
  limit?: number
  status?: string | null
}
export interface GetPaymentDetailsRequest {
  page?: number
  limit?: number
}

export interface PaymentDetailDataExt extends Pagging {
  list: PaymentDetailData[]
}
export interface GetPaymentHistoryResponse extends HttpsResponse {
  data: PaymentHistoryData
}
export interface GetPaymentDetailsResponse extends HttpsResponse {
  data: PaymentDetailDataExt
}
