import { RouteRecordRaw } from 'vue-router'
import { PERMISSION_CODE } from 'src/core/types/permission-code-types'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { useNavigate } from 'src/pages/file-system/hooks/use-navigate'
import { DIR_TYPE } from 'src/core/types/file-types'
import { useProjectNotes } from '../hooks/use-notes'

const PROJECT_MANAGEMENT_ROUTE_NAMES = {
  INDEX: 'project-management',
  ENTRIES: 'project-management-entries',
  SETTINGS: 'project-management-settings',
  MEMBERS: 'project-management-members',
  MEMBERS_DETAIL: 'project-management-members-detail',
  FILES: 'project-management-files',
  NOTEPAGES: 'project-management-notepages',
  NOTES: 'project-management-notepages_detail',
}

const projectManagementRoutes: RouteRecordRaw[] = [
  {
    path: '/project-management',
    name: PROJECT_MANAGEMENT_ROUTE_NAMES.INDEX,
    meta: {
      requiresAuth: true,
      authorizationCode: PERMISSION_CODE.PJ,
    },
    component: () => import('layouts/main-layout.vue'),
    children: [
      {
        name: PROJECT_MANAGEMENT_ROUTE_NAMES.ENTRIES,
        path: '',
        component: () =>
          import('src/pages/project-management/pages/project-entries-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.PJ,
        },
      },
      {
        name: PROJECT_MANAGEMENT_ROUTE_NAMES.MEMBERS,
        path: ':projectId/members',
        component: () =>
          import('src/pages/project-management/pages/project-members-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.PJ,
        },
      },
      {
        name: PROJECT_MANAGEMENT_ROUTE_NAMES.MEMBERS_DETAIL,
        path: ':projectId/members/:userName',
        component: () =>
          import(
            'src/pages/project-management/pages/project-members-detail-page.vue'
          ),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.PJ,
          noFitHeight: true,
        },
      },
      {
        name: PROJECT_MANAGEMENT_ROUTE_NAMES.SETTINGS,
        path: ':projectId/settings',
        component: () =>
          import(
            'src/pages/project-management/pages/project-settings-page.vue'
          ),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.PJ,
          noFitHeight: true,
        },
      },
      {
        name: PROJECT_MANAGEMENT_ROUTE_NAMES.FILES,
        path: ':projectId/:projectTeamId/files',
        component: () =>
          import('src/pages/project-management/pages/project-files-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.PJ,
        },
        beforeEnter: (to) => {
          const teamId = to.params.projectTeamId?.toString()
          const { setRootDirType } = useFileSystemStore()
          const { generateFileSystemRoutePath } = useNavigate()

          setRootDirType({
            id: teamId,
            type: DIR_TYPE.PROJECT,
          })

          if (!to.query?.path) {
            return {
              path: to.path,
              params: { ...to.params },
              query: {
                ...to.query,
                path: generateFileSystemRoutePath(teamId, {
                  id: teamId,
                  type: DIR_TYPE.PROJECT,
                }),
              },
            }
          }
        },
      },
      {
        name: PROJECT_MANAGEMENT_ROUTE_NAMES.NOTEPAGES,
        path: ':projectId/:projectTeamId/notepages',
        component: () =>
          import(
            'src/pages/project-management/pages/project-notepages-page.vue'
          ),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.PJ,
        },
        beforeEnter: async (to) => {
          const { handleGetSessionCredentials } = useProjectNotes()
          const teamId = to.params.projectTeamId?.toString()
          await handleGetSessionCredentials(teamId)
        },
      },
      {
        name: PROJECT_MANAGEMENT_ROUTE_NAMES.NOTES,
        path: ':projectId/:projectTeamId/notepages/:notePageId/notes',
        component: () =>
          import('src/pages/project-management/pages/project-notes-page.vue'),
        meta: {
          requiresAuth: true,
          authorizationCode: PERMISSION_CODE.PJ,
        },
        beforeEnter: async (to) => {
          const { handleGetSessionCredentials } = useProjectNotes()
          const teamId = to.params.projectTeamId?.toString()
          await handleGetSessionCredentials(teamId)
        },
      },
    ],
  },
]

export { projectManagementRoutes, PROJECT_MANAGEMENT_ROUTE_NAMES }
