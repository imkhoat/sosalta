import { storeToRefs } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { PERMISSION_CODE } from 'src/core/types/permission-code-types'
import { useNavigate } from 'src/pages/file-system/hooks/use-navigate'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { useMemberSettings } from '../hooks/use-member-settings'
import { DIR_TYPE } from 'src/core/types/file-types'

const MEMBER_USERS_ROUTE_NAMES = {
  INDEX: 'member-users',
  ENTRIES: 'member-users-entries',
  MEMBER_SETTINGS: 'member-users-settings',
  MEMBER_SETTINGS_DETAIL: 'member-users-settings-detail',
  MEMBER_FILES: 'member-users-files',
}

const memberUsersRoutes: RouteRecordRaw[] = [
  {
    path: '/member-users',
    name: MEMBER_USERS_ROUTE_NAMES.INDEX,
    meta: {
      requiresAuth: true,
      authorizationCode: PERMISSION_CODE.MU,
    },
    component: () => import('layouts/main-layout.vue'),
    children: [
      {
        name: MEMBER_USERS_ROUTE_NAMES.ENTRIES,
        path: '',
        component: () => import('pages/member-users/pages/entries-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.MU,
        },
      },
      {
        name: MEMBER_USERS_ROUTE_NAMES.MEMBER_SETTINGS,
        path: 'member-settings',
        component: () =>
          import('pages/member-users/pages/member-settings-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.MU_MEMBER_SETTINGS,
        },
      },
      {
        name: MEMBER_USERS_ROUTE_NAMES.MEMBER_SETTINGS_DETAIL,
        path: 'member-settings/detail/:userName',
        component: () =>
          import('pages/member-users/pages/member-user-detail-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.MU_MEMBER_SETTINGS,
          noFitHeight: true,
        },
        beforeEnter: () => {
          const { activeUser } = useMemberSettings()

          if (!activeUser.value) {
            return {
              name: MEMBER_USERS_ROUTE_NAMES.MEMBER_SETTINGS,
            }
          }
        },
      },
      {
        name: MEMBER_USERS_ROUTE_NAMES.MEMBER_FILES,
        path: 'member-files/:userName?',
        component: () =>
          import('pages/member-users/pages/member-files-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.MU_MEMBER_FILES,
        },
        beforeEnter: (to) => {
          const { setRootDirType } = useFileSystemStore()
          const { generateFileSystemRoutePath } = useNavigate()
          const { getDefaultRootFolder, getRootFolderId, getActiveUserName } =
            storeToRefs(useFileSystemStore())

          setRootDirType({
            id: getActiveUserName.value ?? '',
            type: DIR_TYPE.MEMBER_USER,
          })

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
      },
    ],
  },
]

export { memberUsersRoutes, MEMBER_USERS_ROUTE_NAMES }
