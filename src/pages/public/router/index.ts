import { FILE_SYSTEM_ROUTE_NAMES } from 'src/pages/file-system/router'
import { RouteRecordRaw } from 'vue-router'

const PUBLIC_ROUTE_NAMES = {
  INDEX: 'public',
  HOME: 'public-home',
  ENTRIES: 'public-entries',
  WELCOME: 'public-welcome',
  ABOUT: 'public-about',
  ABOUT_US: 'public-about-us',
  HELP: 'public-help',
  SUPPORT: 'public-support',
  VIP: 'public-vip',
  PRICING: 'public-pricing',
  TERM: 'public-term',
  DISCLAIMER: 'public-disclaimer',
  POLICY: 'public-policy',
}

const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/public',
    name: PUBLIC_ROUTE_NAMES.INDEX,
    component: () => import('layouts/public-layout.vue'),
    children: [
      {
        path: '',
        name: PUBLIC_ROUTE_NAMES.HOME,
        component: () => import('pages/landing-page/pages/home-page.vue'),
      },
      {
        path: 'welcome',
        name: PUBLIC_ROUTE_NAMES.WELCOME,
        component: () => import('pages/public/pages/welcome-page.vue'),
      },
      {
        path: 'help',
        name: PUBLIC_ROUTE_NAMES.HELP,
        component: () => import('pages/public/pages/help-page.vue'),
      },
      {
        path: 'support',
        name: PUBLIC_ROUTE_NAMES.SUPPORT,
        component: () => import('pages/public/pages/support-page.vue'),
      },
      {
        path: 'vip',
        name: PUBLIC_ROUTE_NAMES.VIP,
        component: () => import('pages/public/pages/vip-page.vue'),
      },
      {
        path: 'pricing',
        name: PUBLIC_ROUTE_NAMES.PRICING,
        component: () => import('pages/public/pages/pricing-page.vue'),
      },
      {
        path: 'term-and-condition-of-use',
        name: PUBLIC_ROUTE_NAMES.TERM,
        component: () => import('pages/public/pages/term-page.vue'),
      },
      {
        path: 'policy',
        name: PUBLIC_ROUTE_NAMES.POLICY,
        component: () => import('pages/public/pages/policy-page.vue'),
      },
      {
        path: 'disclaimer',
        name: PUBLIC_ROUTE_NAMES.DISCLAIMER,
        component: () => import('pages/public/pages/disclaimer-page.vue'),
      },
    ],
  },
  {
    path: '/about',
    name: PUBLIC_ROUTE_NAMES.ABOUT,
    component: () => import('layouts/public-layout.vue'),
    children: [
      {
        path: 'about-us',
        name: PUBLIC_ROUTE_NAMES.ABOUT_US,
        component: () => import('pages/public/pages/about-us.vue'),
      },
    ],
  },
]

export { publicRoutes, PUBLIC_ROUTE_NAMES }
