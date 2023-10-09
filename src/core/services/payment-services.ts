import { https } from 'boot/axios'
import { API } from './utils/apis'
import { errorHandler } from 'src/core/utils/error-handler'
import {
  PayWithBalanceRequest,
  PayWithBalanceResponse,
  CreateAmazonOrderRequest,
  CreateAmazonOrderResponse,
  CreateStripePaymentIntentRequest,
  CreateStripePaymentIntentResponse,
  CreateAmazonConfirmPaymentRequest,
  CreateAmazonConfirmPaymentResponse,
  CreateAmazonCheckoutSessionRequest,
  CreateAmazonCheckoutSessionResponse,
  GetAmazonCheckoutSessionResponse,
  AmazonCompletedOrderRequest,
  AmazonCompletedOrderResponse,
  AmazonUpdatePaymentInformationRequest,
  GetTotalCoinAmountResponse,
  GetTotalBalanceResponse,
  GetPaymentHistoryResponse,
  GetPaymentHistoryRequest,
  GetBilledTotalResponse,
  GetPaymentDetailsRequest,
  GetPaymentDetailsResponse,
} from '../types/services/payment-types'

async function httpsPayWithBalance(params: PayWithBalanceRequest) {
  try {
    const { data } = await https.post<PayWithBalanceResponse>(
      API.PAYMENT.PAY_WITH_BALANCE,
      params
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCreateStripePaymentIntent(
  params: CreateStripePaymentIntentRequest
) {
  try {
    const { data } = await https.post<CreateStripePaymentIntentResponse>(
      API.PAYMENT.STRIPE_CREATE_PAYMENT_INTENT,
      params
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCreateAmazonOrder(params: CreateAmazonOrderRequest) {
  try {
    const { data } = await https.post<CreateAmazonOrderResponse>(
      API.PAYMENT.STRIPE_CREATE_PAYMENT_INTENT,
      params
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}
async function httpsConfirmAmazonPayment(
  params: CreateAmazonConfirmPaymentRequest
) {
  try {
    const { data } = await https.post<CreateAmazonConfirmPaymentResponse>(
      API.PAYMENT.STRIPE_CREATE_PAYMENT_INTENT,
      params
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCreateAmazonCheckoutSession(
  params: CreateAmazonCheckoutSessionRequest
) {
  try {
    const { data } = await https.post<CreateAmazonCheckoutSessionResponse>(
      API.PAYMENT.AMAZON_CREATE_CHECKOUT_SESSION,
      params
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetAmazonCheckoutSession(checkoutSessionId: string) {
  try {
    const { data } = await https.get<GetAmazonCheckoutSessionResponse>(
      `${API.PAYMENT.AMAZON_GET_CHECKOUT_SESSION}/${checkoutSessionId}`
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsAmazonCompletedOrder(params: AmazonCompletedOrderRequest) {
  try {
    const { data } = await https.post<AmazonCompletedOrderResponse>(
      API.PAYMENT.AMAZON_COMPLETED_ORDER,
      params
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsAmazonUpdatePaymentInformation(
  params: AmazonUpdatePaymentInformationRequest
) {
  try {
    const { data } = await https.post<AmazonCompletedOrderResponse>(
      API.PAYMENT.AMAZON_UPDATE_CHECKOUT_SESSION,
      params
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Get total coin amount by account
 */
async function httpsGetTotalCoinAmount() {
  try {
    const { data } = await https.post<GetTotalCoinAmountResponse>(
      API.USER.PAYMENT_TOTAL_COIN_AMOUNT
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Get total coin amount by account
 */
async function httpsGetTotalBalance() {
  try {
    const { data } = await https.get<GetTotalBalanceResponse>(
      API.USER.PAYMENT_TOTAL_BALANCE
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Get total coin amount by account
 */
async function httpsGetBilledTotal() {
  try {
    const { data } = await https.get<GetBilledTotalResponse>(
      API.USER.PAYMENT_GET_BILLED_TOTAL
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Get payment history
 */
async function httpsGetPaymentHistory(payload: GetPaymentHistoryRequest) {
  try {
    const { data } = await https.get<GetPaymentHistoryResponse>(
      API.USER.PAYMENT_HISTORY,
      {
        params: payload,
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

/**
 * Get payment history
 */
async function httpsGetPaymentDetails(payload: GetPaymentDetailsRequest) {
  try {
    const { data } = await https.get<GetPaymentDetailsResponse>(
      API.USER.PAYMENT_GET_PAYMENT_DETAILS,
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
  httpsGetTotalCoinAmount,
  httpsGetPaymentHistory,
  httpsGetTotalBalance,
  httpsPayWithBalance,
  httpsGetBilledTotal,
  httpsGetPaymentDetails,
  httpsCreateAmazonOrder,
  httpsAmazonCompletedOrder,
  httpsConfirmAmazonPayment,
  httpsGetAmazonCheckoutSession,
  httpsCreateStripePaymentIntent,
  httpsCreateAmazonCheckoutSession,
  httpsAmazonUpdatePaymentInformation,
}
