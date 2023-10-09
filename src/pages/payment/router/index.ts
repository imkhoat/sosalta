import { PERMISSION_CODE } from 'src/core/types/permission-code-types'
import { RouteRecordRaw } from 'vue-router'

const PAYMENT_ROUTE_NAMES = {
  INDEX: 'payment',
  ENTRIES: 'payment-entries',
  DETAIL: 'payment-detail',
  ADD_FUND: 'payment-add-fund',
  MY_WALLET: 'payment-my-wallet',
  HISTORY: 'payment-history',
  HISTORY_INVOICE: 'payment-history-invoice',
  DISCOUNT_MY_COUPON: 'payment-discount-my-coupon',
  DISCOUNT_VOUCHER: 'payment-discount-voucher',
  HISTORY_INVOICE_DETAIL: 'payment-history-invoice-detai',
}

const paymentRoutes: RouteRecordRaw[] = [
  {
    path: '/payment',
    name: PAYMENT_ROUTE_NAMES.INDEX,
    component: () => import('layouts/main-layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        name: PAYMENT_ROUTE_NAMES.ENTRIES,
        path: '',
        component: () => import('pages/payment/pages/payment-entries-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.PM,
        },
      },
      {
        name: PAYMENT_ROUTE_NAMES.DETAIL,
        path: 'detail',
        component: () => import('pages/payment/pages/payment-detail-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.PM_PAYMENT_DETAILS,
        },
      },
      {
        name: PAYMENT_ROUTE_NAMES.HISTORY,
        path: 'history',
        component: () => import('pages/payment/pages/payment-history-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.PM_PAYMENT_HISTORY,
        },
      },
      {
        name: PAYMENT_ROUTE_NAMES.HISTORY_INVOICE,
        path: 'history/invoice',
        component: () =>
          import('pages/payment/pages/payment-history-invoice-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.PM_PAYMENT_HISTORY,
        },
      },
      {
        name: PAYMENT_ROUTE_NAMES.ADD_FUND,
        path: 'add-funds',
        component: () =>
          import('pages/payment/pages/payment-add-funds-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.PM_ADD_FUNDS,
        },
      },
      {
        name: PAYMENT_ROUTE_NAMES.MY_WALLET,
        path: 'my-wallet',
        component: () =>
          import('pages/payment/pages/payment-my-wallet-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.PM_MY_WALLET,
        },
      },
      {
        name: PAYMENT_ROUTE_NAMES.DISCOUNT_MY_COUPON,
        path: 'discount/my-coupon',
        component: () =>
          import('pages/payment/pages/discount/discount-my-coupon-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.PM_MY_WALLET,
        },
      },
      {
        name: PAYMENT_ROUTE_NAMES.DISCOUNT_VOUCHER,
        path: 'discount/voucher',
        component: () =>
          import('pages/payment/pages/discount/discount-voucher-page.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
]

export { paymentRoutes, PAYMENT_ROUTE_NAMES }
