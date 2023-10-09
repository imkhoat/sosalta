import { RouteRecordRaw } from 'vue-router'
import { PERMISSION_CODE } from 'src/core/types/permission-code-types'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { useNavigate } from 'src/pages/file-system/hooks/use-navigate'
import { DIR_TYPE } from 'src/core/types/file-types'
import { storeToRefs } from 'pinia'

const TEAM_MANAGEMENT_ROUTE_NAMES = {
  INDEX: 'team-management',
  ENTRIES: 'team-management-entries',
  SETTINGS: 'team-management-settings',
  MEMBERS: 'team-management-members',
  MEMBERS_DETAIL: 'team-management-members-detail',
  FILES: 'team-management-files',
}

const teamManagementRoutes: RouteRecordRaw[] = [
  {
    path: '/team-management',
    name: TEAM_MANAGEMENT_ROUTE_NAMES.INDEX,
    meta: {
      requiresAuth: true,
      authorizationCode: PERMISSION_CODE.TM,
    },
    component: () => import('layouts/main-layout.vue'),
    children: [
      {
        name: TEAM_MANAGEMENT_ROUTE_NAMES.ENTRIES,
        path: '',
        component: () =>
          import('src/pages/team-management/pages/team-entries-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.TM,
        },
      },
      {
        name: TEAM_MANAGEMENT_ROUTE_NAMES.MEMBERS,
        path: ':teamId/members',
        component: () =>
          import('src/pages/team-management/pages/team-members-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.TM_TEAM_SETTINGS,
        },
      },
      {
        name: TEAM_MANAGEMENT_ROUTE_NAMES.MEMBERS_DETAIL,
        path: ':teamId/members/:userName',
        component: () =>
          import(
            'src/pages/team-management/pages/team-members-detail-page.vue'
          ),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.TM_TEAM_SETTINGS,
          noFitHeight: true,
        },
      },
      {
        name: TEAM_MANAGEMENT_ROUTE_NAMES.SETTINGS,
        path: ':teamId/settings',
        component: () =>
          import('src/pages/team-management/pages/team-settings-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.TM_TEAM_SETTINGS,
          noFitHeight: true,
        },
      },
      {
        name: TEAM_MANAGEMENT_ROUTE_NAMES.FILES,
        path: ':teamId/files',
        component: () =>
          import('src/pages/team-management/pages/team-files-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.TM_TEAM_FILES,
        },
        beforeEnter: (to) => {
          const teamId = to.params.teamId?.toString()
          const { setRootDirType } = useFileSystemStore()
          const { generateFileSystemRoutePath } = useNavigate()

          setRootDirType({
            id: teamId,
            type: DIR_TYPE.TEAM,
          })

          if (!to.query?.path) {
            return {
              path: to.path,
              params: { ...to.params },
              query: {
                ...to.query,
                path: generateFileSystemRoutePath(teamId, {
                  id: teamId,
                  type: DIR_TYPE.TEAM,
                }),
              },
            }
          }
        },
      },
    ],
  },
]

export { teamManagementRoutes, TEAM_MANAGEMENT_ROUTE_NAMES }
