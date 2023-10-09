import { useAuthStore } from 'src/core/stores/auth'
import { RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useKeyManager } from '../hooks/use-key-manager'
import { PERMISSION_CODE } from 'src/core/types/permission-code-types'

const KEY_MANAGER_ROUTE_NAMES = {
  INDEX: 'key-manager',
  ENTRIES: 'key-manager-entries',
}

const keyManagerRoutes: RouteRecordRaw[] = [
  {
    path: '/key-manager',
    name: KEY_MANAGER_ROUTE_NAMES.INDEX,
    meta: {
      requiresAuth: true,
      authorizationCode: PERMISSION_CODE.KM,
    },
    component: () => import('layouts/main-layout.vue'),
    children: [
      {
        name: KEY_MANAGER_ROUTE_NAMES.ENTRIES,
        path: '',
        component: () => import('pages/key-manager/pages/entries-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.KM,
        },
        beforeEnter: () => {
          const { getMasterKeySalt } = storeToRefs(useAuthStore())
          const { requestCreateMasterPassword, requestVerifyMasterPassword } =
            useKeyManager()
          if (!getMasterKeySalt.value) {
            requestCreateMasterPassword()
          } else {
            requestVerifyMasterPassword()
          }
        },
      },
    ],
  },
]

export { keyManagerRoutes, KEY_MANAGER_ROUTE_NAMES }
