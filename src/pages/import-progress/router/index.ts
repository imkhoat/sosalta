import { PERMISSION_CODE } from 'src/core/types/permission-code-types'
import { RouteRecordRaw } from 'vue-router'

const IMPORT_PROGRESS_ROUTE_NAMES = {
  INDEX: 'import-progress',
  ENTRIES: 'import-progress-entries',
}

const importProgressRoutes: RouteRecordRaw[] = [
  {
    path: '/import-progress',
    name: IMPORT_PROGRESS_ROUTE_NAMES.INDEX,
    component: () => import('layouts/main-layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        name: IMPORT_PROGRESS_ROUTE_NAMES.ENTRIES,
        path: '',
        component: () => import('pages/import-progress/pages/entries-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.FS_IMPORT,
        },
      },
    ],
  },
]

export { importProgressRoutes, IMPORT_PROGRESS_ROUTE_NAMES }
