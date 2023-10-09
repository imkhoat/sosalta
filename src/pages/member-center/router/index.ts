import { RouteRecordRaw } from 'vue-router'

const MEMBER_CENTER_ROUTE_NAMES = {
  INDEX: 'member-center',
  ENTRIES: 'member-center-entries',
  MEMBERSHIP: 'member-center-membership',
  SUBSCRIPTIONS: 'member-center-subscriptions',
  CHECKOUT: 'member-center-checkout',
  CHECKOUT_REVIEW_ORDER: 'member-center-checkout-review-order',
  CHECKOUT_COMPLETED_ORDER: 'member-center-checkout-completed-order',
  CHECKOUT_THANKYOU: 'member-center-checkout-thankyou',
  CHECKOUT_ERROR: 'member-center-checkout-fail',
}

const memberCenterRoutes: RouteRecordRaw[] = [
  {
    path: '/member-center',
    name: MEMBER_CENTER_ROUTE_NAMES.INDEX,
    component: () => import('layouts/main-layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        name: MEMBER_CENTER_ROUTE_NAMES.ENTRIES,
        path: '',
        component: () => import('pages/member-center/pages/entries-page.vue'),
      },
      {
        name: MEMBER_CENTER_ROUTE_NAMES.MEMBERSHIP,
        path: 'membership',
        meta: { requiresAuth: true },
        component: () =>
          import('src/pages/member-center/pages/my-subscription-page.vue'),
      },
      {
        name: MEMBER_CENTER_ROUTE_NAMES.SUBSCRIPTIONS,
        path: 'subscriptions',
        component: () =>
          import('src/pages/member-center/pages/subscriptions-page.vue'),
        meta: {
          requiresAuth: false,
        },
      },
      {
        name: MEMBER_CENTER_ROUTE_NAMES.CHECKOUT,
        path: 'checkout',
        meta: { requiresAuth: true },
        component: () =>
          import('src/pages/member-center/pages/checkout-page.vue'),
        children: [
          {
            name: MEMBER_CENTER_ROUTE_NAMES.CHECKOUT_REVIEW_ORDER,
            path: 'review-order',
            meta: { requiresAuth: true },
            component: () =>
              import('src/pages/member-center/pages/review-order-page.vue'),
          },
          {
            name: MEMBER_CENTER_ROUTE_NAMES.CHECKOUT_COMPLETED_ORDER,
            path: 'completed-order',
            meta: { requiresAuth: true },
            component: () =>
              import('src/pages/member-center/pages/completed-order-page.vue'),
          },
          {
            name: MEMBER_CENTER_ROUTE_NAMES.CHECKOUT_THANKYOU,
            path: 'thankyou',
            meta: { requiresAuth: true },
            component: () =>
              import('src/pages/member-center/pages/thankyou-page.vue'),
          },
          {
            name: MEMBER_CENTER_ROUTE_NAMES.CHECKOUT_ERROR,
            path: 'error',
            meta: { requiresAuth: true },
            component: () =>
              import('src/pages/member-center/pages/error-page.vue'),
          },
        ],
      },
    ],
  },
]

export { memberCenterRoutes, MEMBER_CENTER_ROUTE_NAMES }
