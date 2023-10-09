import { RouteRecordRaw } from 'vue-router'
import {
  fileSystemRoutes,
  FILE_SYSTEM_ROUTE_NAMES,
} from 'src/pages/file-system/router'
import { authRoutes, AUTH_ROUTE_NAMES } from 'src/pages/auth/router'
import { publicRoutes, PUBLIC_ROUTE_NAMES } from 'src/pages/public/router'
import {
  dashboardRoutes,
  DASHBOARD_ROUTE_NAMES,
} from 'src/pages/dashboard/router'
import {
  keyManagerRoutes,
  KEY_MANAGER_ROUTE_NAMES,
} from 'src/pages/key-manager/router'
import {
  accountSettingRoutes,
  ACCOUNT_SETTING_ROUTE_NAMES,
} from 'src/pages/account-setting/router'
import {
  memberCenterRoutes,
  MEMBER_CENTER_ROUTE_NAMES,
} from 'src/pages/member-center/router'
import {
  teamManagementRoutes,
  TEAM_MANAGEMENT_ROUTE_NAMES,
} from 'src/pages/team-management/router'
import {
  projectManagementRoutes,
  PROJECT_MANAGEMENT_ROUTE_NAMES,
} from 'src/pages/project-management/router'
import {
  importProgressRoutes,
  IMPORT_PROGRESS_ROUTE_NAMES,
} from 'src/pages/import-progress/router'
import { cloudPCRoutes, CLOUD_PC_ROUTE_NAMES } from 'src/pages/cloud-pc/router'
import {
  cloudAppRoutes,
  CLOUD_APP_ROUTE_NAMES,
} from 'src/pages/cloud-app/router'
import {
  recycleBinRoutes,
  RECYCLE_BIN_ROUTE_NAMES,
} from 'src/pages/recycle-bin/router'
import {
  memberUsersRoutes,
  MEMBER_USERS_ROUTE_NAMES,
} from 'src/pages/member-users/router'
import {
  OPERATION_LOGGING_ROUTE_NAMES,
  operationLoggingRoutes,
} from 'src/pages/operation-logging/router'
import { PAYMENT_ROUTE_NAMES, paymentRoutes } from 'src/pages/payment/router'
const routes: RouteRecordRaw[] = [
  ...publicRoutes,
  ...authRoutes,
  ...keyManagerRoutes,
  ...fileSystemRoutes,
  ...memberCenterRoutes,
  ...accountSettingRoutes,
  ...teamManagementRoutes,
  ...projectManagementRoutes,
  ...cloudAppRoutes,
  ...cloudPCRoutes,
  ...memberUsersRoutes,
  ...importProgressRoutes,
  ...dashboardRoutes,
  ...paymentRoutes,
  ...recycleBinRoutes,
  ...operationLoggingRoutes,
  {
    path: '/',
    name: 'landing-page',
    component: () => import('layouts/landing-layout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        name: 'home-page',
        path: '',
        component: () => import('pages/landing-page/pages/home-page.vue'),
      },
    ],
  },
  {
    path: '/cloud-app',
    name: 'cloud-app',
    component: () => import('layouts/main-layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        name: 'cloud-app-run',
        path: 'run-apps',
        component: () => import('pages/cloud-app/pages/entries-page.vue'),
      },
      {
        name: 'cloud-app-result',
        path: 'result',
        component: () => import('pages/cloud-app/pages/entries-page.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/error-page.vue'),
  },
]

export {
  AUTH_ROUTE_NAMES,
  PUBLIC_ROUTE_NAMES,
  CLOUD_PC_ROUTE_NAMES,
  CLOUD_APP_ROUTE_NAMES,
  KEY_MANAGER_ROUTE_NAMES,
  FILE_SYSTEM_ROUTE_NAMES,
  MEMBER_USERS_ROUTE_NAMES,
  MEMBER_CENTER_ROUTE_NAMES,
  IMPORT_PROGRESS_ROUTE_NAMES,
  ACCOUNT_SETTING_ROUTE_NAMES,
  TEAM_MANAGEMENT_ROUTE_NAMES,
  PROJECT_MANAGEMENT_ROUTE_NAMES,
  DASHBOARD_ROUTE_NAMES,
  RECYCLE_BIN_ROUTE_NAMES,
  OPERATION_LOGGING_ROUTE_NAMES,
  PAYMENT_ROUTE_NAMES,
  routes,
}
