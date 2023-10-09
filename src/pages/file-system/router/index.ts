import { storeToRefs } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { useNavigate } from '../hooks/use-navigate'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { useAuthStore } from 'src/core/stores/auth'
import { PERMISSION_CODE } from 'src/core/types/permission-code-types'
import { DIR_TYPE } from 'src/core/types/file-types'

const FILE_SYSTEM_ROUTE_NAMES = {
  INDEX: 'file-system',
  ENTRIES: 'file-system-entries',
}

const fileSystemRoutes: RouteRecordRaw[] = [
  {
    path: '/file-system',
    name: FILE_SYSTEM_ROUTE_NAMES.INDEX,
    meta: { requiresAuth: true },
    component: () => import('layouts/main-layout.vue'),
    children: [
      {
        name: FILE_SYSTEM_ROUTE_NAMES.ENTRIES,
        path: '',
        component: () => import('pages/file-system/pages/entries-page.vue'),
        beforeEnter: (to) => {
          const { setActiveUserInfo, setRootDirType } = useFileSystemStore()
          const { generateFileSystemRoutePath } = useNavigate()
          const { getUserInformation } = storeToRefs(useAuthStore())

          const { getDefaultRootFolder, getRootFolderId, getActiveUserName } =
            storeToRefs(useFileSystemStore())

          setActiveUserInfo(getUserInformation.value)
          setRootDirType({ id: getRootFolderId.value, type: DIR_TYPE.STORAGE })

          if (!to.query?.path) {
            return {
              path: to.path,
              params: { ...to.params },
              query: {
                ...to.query,
                path: generateFileSystemRoutePath(
                  getActiveUserName.value || '',
                  getDefaultRootFolder.value.get(getRootFolderId.value)
                ),
              },
            }
          }
        },
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.FS,
        },
      },
    ],
  },
]

export { fileSystemRoutes, FILE_SYSTEM_ROUTE_NAMES }
