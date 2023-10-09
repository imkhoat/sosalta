import { RouteRecordRaw } from 'vue-router'
import { PERMISSION_CODE } from 'src/core/types/permission-code-types'

const CLOUD_APP_ROUTE_NAMES = {
  INDEX: 'cloud-app',
  ENTRIES: 'cloud-app-entries',
}

const cloudAppRoutes: RouteRecordRaw[] = [
  {
    path: '/cloud-app',
    name: CLOUD_APP_ROUTE_NAMES.INDEX,
    meta: {
      requiresAuth: true,
      authorizationCode: PERMISSION_CODE.CA,
    },
    component: () => import('layouts/main-layout.vue'),
    children: [
      {
        name: CLOUD_APP_ROUTE_NAMES.ENTRIES,
        path: '',
        component: () => import('pages/cloud-app/pages/entries-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.CA,
        },
      },
    ],
  },
]

export { cloudAppRoutes, CLOUD_APP_ROUTE_NAMES }
