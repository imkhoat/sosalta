export enum USER_ROLE {
  ADMINISTRATOR = 'orgAdmin',
  MEMBER_MANAGER = 'memberManager',
  PAYMENT_MANAGER = 'paymentManager',
  MEMBER = 'orgUser',
  MEMBER_PAYMENT_MANAGER = 'memberPaymentManager',
}

export type UserRole = `${USER_ROLE}`
