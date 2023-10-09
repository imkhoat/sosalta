import { RouteRecordRaw } from 'vue-router'

const OPERATION_LOGGING_ROUTE_NAMES = {
  INDEX: 'operation-logging',
  ENTRIES: 'operation-logging-entries',
}

const operationLoggingRoutes: RouteRecordRaw[] = [
  {
    path: '/operation-logging',
    name: OPERATION_LOGGING_ROUTE_NAMES.INDEX,
    component: () => import('layouts/main-layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        name: OPERATION_LOGGING_ROUTE_NAMES.ENTRIES,
        path: '',
        component: () =>
          import('pages/operation-logging/pages/entries-page.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
]

export { operationLoggingRoutes, OPERATION_LOGGING_ROUTE_NAMES }
