export interface PaymentHistory {
  userName: string
  outTradeNo: string
  payMethod: PaymentHistoryMethod
  orderStatus: PaymentHistoryOrderStatus
  subject: string
  totalAmount: number
  primeAmount: number
  memberOrder: {
    packageId: number
    memberInfoId: number
    expireDateOfDay: number
    status: SubscriptionType
  }
  coinsAmount: number
  gmtCreate: number
  noteType: string
  type: PaymentHistoryType
  referenceId: string
  gmtLoggingTimeString?: string
  totalPriceString?: string
  originalPriceString?: string
}

export enum PAYMENT_HISTORY_TYPE {
  SUBSCRIPTION_UPGRADE = 1,
  ADD_ACCOUNT_FUND = 2,
}

export type PaymentHistoryType = `${PAYMENT_HISTORY_TYPE}`

export enum PAYMENT_HISTORY_METHOD {
  AMAZON_PAY = 'AmazonPay',
  STRIPE_PAY = 'Stripe-Pay',
  WALLET_PAY = 'balancepayment',
}

export type PaymentHistoryMethod = `${PAYMENT_HISTORY_METHOD}`

export enum PAYMENT_HISTORY_ORDER_STATUS {
  REQUIRES_PAYMENT_METHOD = 'requires_payment_method',
  TRADE_SUCCESS = 'TRADE_SUCCESS',
  WALLET_PAY = 'balancepayment',
}

export type PaymentHistoryOrderStatus = `${PAYMENT_HISTORY_ORDER_STATUS}`

export enum SUBSCRIPTION_TYPE {
  RENEW = 1,
  UPGRADE = 2,
}

export type SubscriptionType = `${SUBSCRIPTION_TYPE}`
