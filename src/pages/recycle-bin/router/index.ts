import { RouteRecordRaw } from 'vue-router'
import { PERMISSION_CODE } from 'src/core/types/permission-code-types'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { useNavigate } from 'src/pages/file-system/hooks/use-navigate'
import { useAuthStore } from 'src/core/stores/auth'
import { storeToRefs } from 'pinia'
import { DIR_TYPE } from 'src/core/types/file-types'

const RECYCLE_BIN_ROUTE_NAMES = {
  INDEX: 'recycle-bin',
  ENTRIES: 'recycle-bin-entries',
}

const recycleBinRoutes: RouteRecordRaw[] = [
  {
    path: '/recycle-bin',
    name: RECYCLE_BIN_ROUTE_NAMES.INDEX,
    meta: {
      requiresAuth: true,
      authorizationCode: PERMISSION_CODE.RB,
    },
    component: () => import('layouts/main-layout.vue'),
    children: [
      {
        name: RECYCLE_BIN_ROUTE_NAMES.ENTRIES,
        path: '',
        component: () => import('pages/recycle-bin/pages/entries-page.vue'),
        beforeEnter: (to) => {
          const { setActiveUserInfo, setRootDirType } = useFileSystemStore()
          const { generateFileSystemRoutePath } = useNavigate()
          const { getUserInformation } = storeToRefs(useAuthStore())

          const { getDefaultRootFolder, getTrashId, getActiveUserName } =
            storeToRefs(useFileSystemStore())

          setActiveUserInfo(getUserInformation.value)
          setRootDirType({ id: getTrashId.value, type: DIR_TYPE.TRASH })

          if (!to.query?.path) {
            return {
              path: to.path,
              params: { ...to.params },
              query: {
                ...to.query,
                path: generateFileSystemRoutePath(
                  getTrashId.value || '',
                  getDefaultRootFolder.value.get(getTrashId.value)
                ),
              },
            }
          }
        },
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.RB,
        },
      },
    ],
  },
]

export { recycleBinRoutes, RECYCLE_BIN_ROUTE_NAMES }
