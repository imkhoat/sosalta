import { RouteRecordRaw } from 'vue-router'

const AUTH_ROUTE_NAMES = {
  INDEX: 'auth',
  LOGIN: 'auth-login',
  SIGNUP: 'auth-signup',
  FORGOT_PASSWORD: 'auth-forgot-password',
  SIGNUP_STEPS: 'auth-signup-step',
}

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: AUTH_ROUTE_NAMES.INDEX,
    component: () => import('layouts/auth-layout.vue'),
    children: [
      {
        name: AUTH_ROUTE_NAMES.LOGIN,
        path: 'login',
        component: () => import('pages/auth/pages/login-page.vue'),
      },
      {
        name: AUTH_ROUTE_NAMES.SIGNUP,
        path: 'signup',
        component: () => import('pages/auth/pages/signup-page.vue'),
      },
      {
        name: AUTH_ROUTE_NAMES.SIGNUP_STEPS,
        path: 'signup-step',
        component: () => import('pages/auth/pages/signup-by-step-page.vue'),
      },
      {
        name: AUTH_ROUTE_NAMES.FORGOT_PASSWORD,
        path: 'forgot-password',
        component: () => import('pages/auth/pages/forgot-password-page.vue'),
      },
    ],
  },
]

export { authRoutes, AUTH_ROUTE_NAMES }
