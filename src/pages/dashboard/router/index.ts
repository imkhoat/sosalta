import { RouteRecordRaw } from 'vue-router'

const DASHBOARD_ROUTE_NAMES = {
  INDEX: 'dashboard',
  ENTRIES: 'dashboard-entries',
}

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: DASHBOARD_ROUTE_NAMES.INDEX,
    meta: { requiresAuth: true },
    component: () => import('layouts/main-layout.vue'),
    children: [
      {
        name: DASHBOARD_ROUTE_NAMES.ENTRIES,
        path: '',
        component: () => import('src/pages/dashboard/pages/entries-page.vue'),
      },
    ],
  },
]

export { dashboardRoutes, DASHBOARD_ROUTE_NAMES }
