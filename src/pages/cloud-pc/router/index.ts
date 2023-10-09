import { RouteRecordRaw } from 'vue-router'
import { PERMISSION_CODE } from 'src/core/types/permission-code-types'
import { useNavigate } from 'src/pages/file-system/hooks/use-navigate'
import { RootDirType } from 'src/core/types/root-dir-types'

const CLOUD_PC_ROUTE_NAMES = {
  INDEX: 'cloud-pc',
  ENTRIES: 'cloud-pc-entries',
  DATA_DRIVE: 'cloud-pc-data-drive',
  DATA_DRIVE_FILE: 'cloud-pc-data-drive-file',
  MACHINE_IMAGE: 'cloud-pc-machine-image',
  MACHINE_INSTANCES: 'machine-instances',
  MACHINE_INSTANCE_DETAIL: 'machine-instance-detail',
}

const cloudPCRoutes: RouteRecordRaw[] = [
  {
    path: '/cloud-pc',
    name: CLOUD_PC_ROUTE_NAMES.INDEX,
    meta: {
      requiresAuth: true,
      authorizationCode: PERMISSION_CODE.CP,
    },
    component: () => import('layouts/main-layout.vue'),
    children: [
      {
        name: CLOUD_PC_ROUTE_NAMES.ENTRIES,
        path: '',
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.CP,
        },
        redirect: () => {
          return { name: CLOUD_PC_ROUTE_NAMES.DATA_DRIVE }
        },
      },
      {
        name: CLOUD_PC_ROUTE_NAMES.DATA_DRIVE,
        path: 'data-drive',
        component: () => import('src/pages/cloud-pc/pages/data-drive-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.CP_DATA_DRIVE_ACCESS,
        },
      },
      {
        name: CLOUD_PC_ROUTE_NAMES.DATA_DRIVE_FILE,
        path: 'data-drive/:fileSystemId',
        component: () =>
          import('src/pages/cloud-pc/pages/data-drive-file-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.CP_DATA_DRIVE_ACCESS,
        },
        beforeEnter: (to) => {
          const { generateFileSystemRoutePath } = useNavigate()

          if (!to.query?.path) {
            return {
              path: to.path,
              params: { ...to.params },
              query: {
                ...to.query,
                path: generateFileSystemRoutePath(
                  to.params?.fileSystemId.toString(),
                  {} as RootDirType
                ),
              },
            }
          }
        },
      },
      {
        name: CLOUD_PC_ROUTE_NAMES.MACHINE_IMAGE,
        path: 'machine-image',
        component: () =>
          import('src/pages/cloud-pc/pages/machine-images-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.CP,
        },
      },
      {
        name: CLOUD_PC_ROUTE_NAMES.MACHINE_INSTANCES,
        path: 'machine-instances',
        component: () =>
          import('src/pages/cloud-pc/pages/machine-instances-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.CP,
        },
      },
      {
        name: CLOUD_PC_ROUTE_NAMES.MACHINE_INSTANCE_DETAIL,
        path: 'machine-instances/:instanceId',
        component: () =>
          import('src/pages/cloud-pc/pages/machine-instance-detail-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.CP,
        },
      },
    ],
  },
]

export { cloudPCRoutes, CLOUD_PC_ROUTE_NAMES }
