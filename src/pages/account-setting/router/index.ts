import { PERMISSION_CODE } from 'src/core/types/permission-code-types'
import { RouteRecordRaw } from 'vue-router'

const ACCOUNT_SETTING_ROUTE_NAMES = {
  INDEX: 'account-setting',
  ENTRIES: 'account-setting-entries',
}

const accountSettingRoutes: RouteRecordRaw[] = [
  {
    path: '/account-setting',
    name: ACCOUNT_SETTING_ROUTE_NAMES.INDEX,
    component: () => import('layouts/main-layout.vue'),
    meta: { requiresAuth: true, authorizationCode: PERMISSION_CODE.AT },
    children: [
      {
        name: ACCOUNT_SETTING_ROUTE_NAMES.ENTRIES,
        path: '',
        component: () => import('pages/account-setting/pages/entries-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.AT_ACCOUNT_SETTINGS,
        },
      },
    ],
  },
]

export { accountSettingRoutes, ACCOUNT_SETTING_ROUTE_NAMES }
