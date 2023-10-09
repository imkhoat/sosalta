import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { reactive, ref } from 'vue'
import {
  httpsAssignRole,
  httpsCreateNewRole,
  httpsDeleteRole,
  httpsGetAssignedRole,
  httpsGetMemberUserRoles,
  httpsGetTeamMenusByRole,
} from 'src/core/services/user-services'
import {
  AssignRoleRequest,
  CreateNewRoleRequest,
  GetAssignedRoleRequest,
} from 'src/core/types/services/user-types'
import { UserMenu } from 'src/core/types/user-menu'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { PermissionRole } from 'src/core/types/permission-role-types'
import { TeamPermissionCodeType } from 'src/core/types/team-permission-code-types'

const modal = reactive<{
  open: boolean
  type:
    | 'DELETE_ROLE_MODAL'
    | 'UPDATE_ROLE_MODAL'
    | 'CREATE_NEW_ROLE_MODAL'
    | 'VIEW_DETAIL_ROLE_PERMISSIONS_MODAL'
}>({
  open: false,
  type: 'CREATE_NEW_ROLE_MODAL',
})
const roleTemplates = ref<PermissionRole[]>()
const activeRole = ref<PermissionRole | null>()
const defaultRole = ref<PermissionRole | null>()
const readOnlyRole = ref<PermissionRole | null>()
const assignedRoleId = ref<string | number | null>(null)
const activeTeamRoleMenus = ref<Map<TeamPermissionCodeType, UserMenu[]>>(
  new Map<TeamPermissionCodeType, UserMenu[]>()
)

export function useTeamRoles() {
  //composable
  const $q = useQuasar()
  const { t } = useI18n()
  //data
  const loading = ref(false)

  // methods
  function onCloseModal() {
    modal.open = false
  }

  function onToggleModal() {
    modal.open = !modal.open
  }

  function onCreateNewRole() {
    modal.open = true
    modal.type = 'CREATE_NEW_ROLE_MODAL'
  }

  function onUpdateRole(role: PermissionRole) {
    activeRole.value = role
    modal.open = true
    modal.type = 'UPDATE_ROLE_MODAL'
  }

  function onDeleteRole(role: PermissionRole | null) {
    if (!role) {
      throw new Error(t(`pages.teamManagement.entries.Selected role not exist`))
    }
    activeRole.value = role
    modal.type = 'DELETE_ROLE_MODAL'
    modal.open = true
  }

  async function onViewDetailRolePermissions(role: PermissionRole) {
    activeRole.value = role
    modal.open = true
    modal.type = 'VIEW_DETAIL_ROLE_PERMISSIONS_MODAL'

    activeTeamRoleMenus.value = await handleFetchingUserDetailMenusByRole(
      activeRole?.value?.id
    )
  }

  async function handleDeleteRole() {
    try {
      if (!activeRole?.value?.id) {
        $q.notify({
          message: t(
            `pages.teamManagement.entries.Please select role to delete`
          ),
          type: 'negative',
        })
        return false
      }

      loading.value = true
      const data = await httpsDeleteRole(activeRole.value?.id)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t(`pages.teamManagement.entries.Delete role success`),
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleFetchingUserDetailMenusByRole(
    roleId: number | undefined
  ) {
    let menus = new Map<TeamPermissionCodeType, UserMenu[]>()

    try {
      loading.value = true
      if (!roleId) {
        throw new Error(
          t(`pages.teamManagement.entries.Please select role to view`)
        )
      }
      const data = await httpsGetTeamMenusByRole(roleId)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        menus = _handleFlatingMenus(data?.data)
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
      return menus
    }
  }

  async function handleCreateNewRole(payload: CreateNewRoleRequest) {
    try {
      loading.value = true
      const data = await httpsCreateNewRole(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        if (payload?.roleId) {
          $q.notify({
            message: t(`pages.teamManagement.entries.Update role success`),
            type: 'positive',
          })
        } else {
          $q.notify({
            message: t(`pages.teamManagement.entries.Create role success`),
            type: 'positive',
          })
        }
        return true
      }

      return false
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleGetPermissionRoles() {
    try {
      loading.value = true
      const data = await httpsGetMemberUserRoles('team')

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        roleTemplates.value = data?.data
        defaultRole.value =
          data?.data.find((item) => item.roleName === 'Normal') ?? data?.data[0]
        readOnlyRole.value =
          data?.data.find((item) => item.roleName === 'Read-Only') ??
          data?.data[0]
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleGetReadOnlyPermissionRoles() {
    try {
      loading.value = true
      const data = await httpsGetMemberUserRoles('team')

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        const readonlyRole =
          data?.data.find((item) => item.defaultRole) ?? data?.data[0]

        const permissions = await handleFetchingUserDetailMenusByRole(
          readonlyRole?.id
        )
        return permissions
      }
      return null
    } catch (error) {
      return null
    } finally {
      loading.value = false
    }
  }

  async function handleAssignRole(payload: AssignRoleRequest) {
    try {
      loading.value = true
      const data = await httpsAssignRole(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t(`pages.teamManagement.entries.Assign role success`),
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleFetchAssignedRoleId(teamId: string, userName: string) {
    try {
      loading.value = true

      if (!userName) {
        $q.notify({
          message: t(`pages.teamManagement.entries.Please select user to view`),
          type: 'negative',
        })
        return
      }

      const payload: GetAssignedRoleRequest = {
        module: 'team',
        moduleItem: teamId,
        userName: userName,
      }

      const data = await httpsGetAssignedRole(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        assignedRoleId.value = data?.data?.id
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  function _handleFlatingMenus(menus: UserMenu[] | undefined) {
    const menuMap = new Map<TeamPermissionCodeType, UserMenu[]>()
    menus?.forEach((menu) => {
      if (menu?.authType) {
        const currentMenus = menuMap.get(menu.authType)?.values() ?? []
        menuMap.set(menu.authType, [...currentMenus, menu])
      }
    })

    return menuMap
  }

  return {
    modal,
    loading,
    activeRole,
    defaultRole,
    readOnlyRole,
    roleTemplates,
    assignedRoleId,
    activeTeamRoleMenus,
    onDeleteRole,
    onUpdateRole,
    onCloseModal,
    onToggleModal,
    onCreateNewRole,
    handleAssignRole,
    handleDeleteRole,
    handleCreateNewRole,
    handleGetPermissionRoles,
    handleFetchAssignedRoleId,
    onViewDetailRolePermissions,
    handleGetReadOnlyPermissionRoles,
    handleFetchingUserDetailMenusByRole,
  }
}
