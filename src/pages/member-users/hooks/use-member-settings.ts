import { TrueName, UserInfo } from 'src/core/types/user-info'
import { reactive, ref } from 'vue'
import {
  httpsAssignRole,
  httpsCheckEmailLimit,
  httpsCheckRegisterLimit,
  httpsCreateNewMembers,
  httpsCreateNewRole,
  httpsDeleteRole,
  httpsDeleteUser,
  httpsGetAllocationLimit,
  httpsGetAssignedRole,
  httpsGetMemberUserRoles,
  httpsGetMenusByRole,
  httpsGetMenusByUser,
  httpsGetUserList,
  httpsUpdateAuth,
  httpsUpdateManagerRole,
  httpsUpdateManagingUser,
  httpsUpdateTrueName,
} from 'src/core/services/user-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { UserRole } from 'src/core/types/user-role-types'
import { format } from 'date-fns'
import { UserMenu } from 'src/core/types/user-menu'
import { useQuasar } from 'quasar'
import {
  AssignRoleRequest,
  CheckEmailLimitRequest,
  CreateNewMembersRequest,
  CreateNewRoleRequest,
  DeleteUserRequest,
  GetAssignedRoleRequest,
  UpdateAuthRequest,
} from 'src/core/types/services/user-types'
import { PermissionRole } from 'src/core/types/permission-role-types'
import { PermissionCodeType } from 'src/core/types/permission-code-types'
import { AllocationLimits } from 'src/core/types/allocation-limit-types'
import { useRouter } from 'vue-router'
import { MEMBER_USERS_ROUTE_NAMES } from '../router'

const modal = reactive<{
  open: boolean
  type:
    | 'DELETE_MODAL'
    | 'DELETE_ACTIVE_MODAL'
    | 'VIEW_ROLE_MODAL'
    | 'NEW_MEMBER_MODAL'
    | 'DELETE_ROLE_MODAL'
    | 'NEW_ROLE_MODAL'
    | 'NEW_ROLE_WITH_EXIST_PERMISSION_MODAL'
    | 'ASSIGN_ROLE_MODAL'
    | 'UPDATE_ROLE_MODAL'
    | 'RENAME_MEMBER_MODAL'
}>({
  open: false,
  type: 'DELETE_MODAL',
})

const activeUser = ref<UserInfo | null>(null)
const activeRole = ref<PermissionRole | null>()
const flatMenus = ref<Map<PermissionCodeType, UserMenu>>(new Map())
const selectUsers = ref<UserInfo[]>([])

export function useMemberSettings() {
  const $q = useQuasar()
  const router = useRouter()

  const users = ref<UserInfo[]>()
  const loading = ref(false)
  const roleTemplates = ref<PermissionRole[]>()
  const allocationLimits = ref<AllocationLimits | null>(null)
  const assignedRoleId = ref<string | number | null>(null)
  const roles = new Map<UserRole, string>()
  roles.set('memberManager', 'Manager')
  roles.set('orgAdmin', 'Administrator')
  roles.set('memberPaymentManager', 'Payment Manager & Member Manager')
  roles.set('orgUser', 'Member')
  roles.set('paymentManager', 'Payment Manager')

  function onDeleteUser(user: UserInfo | null) {
    if (!user) {
      throw new Error('Select user not exist')
    }
    activeUser.value = user
    modal.type = 'DELETE_ACTIVE_MODAL'
    modal.open = true
  }

  function onDeleteRole(role: PermissionRole | null) {
    if (!role) {
      throw new Error('Select role not exist')
    }
    activeRole.value = role
    modal.type = 'DELETE_ROLE_MODAL'
    modal.open = true
  }

  function onViewUser(user: UserInfo) {
    activeUser.value = user
    router.push({
      name: MEMBER_USERS_ROUTE_NAMES.MEMBER_SETTINGS_DETAIL,
      params: { userName: activeUser.value?.userName },
    })
  }

  function onCreateNewUser() {
    modal.type = 'NEW_MEMBER_MODAL'
    modal.open = true
  }

  function onRenameUser(user: UserInfo | undefined) {
    if (!user) {
      $q.notify({
        message: 'Mising active user',
        type: 'negative',
      })
      return
    }

    activeUser.value = user
    modal.type = 'RENAME_MEMBER_MODAL'
    modal.open = true
  }

  function onUpdateRole(role: PermissionRole) {
    activeRole.value = role
    modal.open = true
    modal.type = 'UPDATE_ROLE_MODAL'
  }

  function onViewRole() {
    modal.type = 'VIEW_ROLE_MODAL'
    modal.open = true
  }

  function onAssignRole() {
    if (selectUsers?.value?.length === 0) {
      $q.notify({
        message: 'Please select users to assign',
        type: 'negative',
      })
      return
    }
    modal.type = 'ASSIGN_ROLE_MODAL'
    modal.open = true
  }

  function onCreateNewRole() {
    modal.type = 'NEW_ROLE_MODAL'
    modal.open = true
  }

  function onCreateNewRoleWithCurrentPermission() {
    modal.type = 'NEW_ROLE_WITH_EXIST_PERMISSION_MODAL'
    modal.open = true
  }

  function onToggleModal() {
    modal.open = !modal.open
  }

  function onCloseModal() {
    modal.open = false
  }

  async function onFetchingData() {
    try {
      loading.value = true
      const data = await httpsGetUserList()

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        users.value =
          data?.data.map((user) => {
            return {
              id: user.userName,
              ...user,
              roleNameString: roles.get(user.roleName),
              gmtCreateAtString: format(
                new Date(user.gmtCreate || ''),
                'MMM dd, yyyy'
              ).toString(),
            }
          }) ?? []
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleGetUserDetail() {
    try {
      loading.value = true
      flatMenus.value = await fetchUserDetailMenus(activeUser.value?.userName)
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchUserDetailMenus(userName: string | undefined) {
    let menus = new Map<PermissionCodeType, UserMenu>()

    try {
      loading.value = true
      if (!userName) {
        throw new Error('Please input user to view')
      }
      const data = await httpsGetMenusByUser(userName)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        menus = handleFlatingMenus(data?.data)
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
      return menus
    }
  }

  async function fetchUserDetailMenusByRole(roleId: number | undefined) {
    let menus = new Map<PermissionCodeType, UserMenu>()

    try {
      loading.value = true
      if (!roleId) {
        throw new Error('Please select role to view')
      }
      const data = await httpsGetMenusByRole(roleId)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        menus = handleFlatingMenus(data?.data)
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
      return menus
    }
  }

  async function handleDeleteUser(
    email: string | null | undefined,
    password: string | null | undefined,
    smsCode: string | null | undefined,
    trueName: string | null | undefined,
    userName: string | null | undefined
  ) {
    try {
      if (!email || !password || !smsCode || !trueName || !userName) {
        throw new Error('Missing required data')
      }

      loading.value = true
      const payload: DeleteUserRequest = {
        email,
        password,
        smsCode,
        trueName,
        userName,
      }

      const data = await httpsDeleteUser(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Delete user success',
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

  async function handleUpdateTrueName(trueName: TrueName) {
    try {
      loading.value = true
      if (!trueName || !activeUser.value?.userName) {
        throw new Error('Please input name')
      }

      const data = await httpsUpdateTrueName({
        trueName: JSON.stringify(trueName),
        userName: activeUser.value?.userName,
      })

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Update success',
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

  async function handleCreateNewMember(emails: string[], userName: string) {
    try {
      loading.value = true
      const params: CreateNewMembersRequest = {
        emails,
        event: 'register',
        userName: userName,
      }
      const data = await httpsCreateNewMembers(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'An invitation email send success',
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

  async function handleGetRegisterLimit() {
    try {
      loading.value = true
      const data = await httpsCheckRegisterLimit()

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data?.limit - data?.data?.current
      }

      return 0
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleCheckEmailLimit(emails: string[]) {
    try {
      loading.value = true
      const datas = await Promise.all(
        emails.map((email) => {
          const payload: CheckEmailLimitRequest = {
            email,
            event: 'register',
          }
          return httpsCheckEmailLimit(payload)
        })
      )

      datas.forEach((element) => {
        if (element?.code !== RESPONSE_CODE.SUCCESS) return false
      })

      return true
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleGetPermissionRoles() {
    try {
      loading.value = true
      const data = await httpsGetMemberUserRoles('member_user')

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        roleTemplates.value = data?.data
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  function handleFlatingMenus(menus: UserMenu[] | undefined) {
    const menuMap = new Map<PermissionCodeType, UserMenu>()

    menus?.forEach((menu) => {
      menuMap.set(menu.code, menu)
      menu.children?.forEach((subMenu) => {
        menuMap.set(subMenu.code, subMenu)
      })
    })

    return menuMap
  }

  async function handleUpdateAuth(payload: UpdateAuthRequest) {
    try {
      loading.value = true
      const data = await httpsUpdateAuth(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Update success',
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

  async function handleGetAllocationLitmit(userName: string) {
    try {
      allocationLimits.value = await fetchAllocationLitmit(userName)
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchAllocationLitmit(userName: string | undefined) {
    let limit = null

    try {
      loading.value = true

      if (!userName) {
        throw new Error('Please input name')
      }

      const data = await httpsGetAllocationLimit(userName)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        limit = data?.data
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
      return limit
    }
  }

  async function handleDeleteRole() {
    try {
      if (!activeRole?.value?.id) {
        $q.notify({
          message: 'Please select role to delete',
          type: 'negative',
        })
        return false
      }

      loading.value = true
      const data = await httpsDeleteRole(activeRole.value?.id)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Delete role success',
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

  async function handleCreateNewRole(payload: CreateNewRoleRequest) {
    try {
      loading.value = true
      const data = await httpsCreateNewRole(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Create role success',
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

  async function handleAssignRole(payload: AssignRoleRequest) {
    try {
      loading.value = true
      const data = await httpsAssignRole(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Assign role success',
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

  async function fetchAssignedRole() {
    try {
      loading.value = true

      if (!activeUser.value?.userName) {
        $q.notify({
          message: 'Please select user to view',
          type: 'negative',
        })
        return
      }

      const payload: GetAssignedRoleRequest = {
        module: 'member_user',
        moduleItem: '',
        userName: activeUser.value?.userName,
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

  function setActiveUser(user: UserInfo) {
    activeUser.value = user
  }

  async function handleAssignSpecialRole(specialRoleType: UserRole) {
    try {
      loading.value = true

      const data = await httpsUpdateManagerRole(
        specialRoleType,
        activeUser.value?.userName ?? ''
      )

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return true
      }
      return false
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleUpdateManagingUser(specialRolesUser: string[]) {
    try {
      loading.value = true

      const payload = {
        users: specialRolesUser,
        userName: activeUser.value?.userName ?? '',
      }

      const data = await httpsUpdateManagingUser(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return true
      }
      return false
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    modal,
    users,
    loading,
    flatMenus,
    activeRole,
    activeUser,
    selectUsers,
    assignedRoleId,
    roleTemplates,
    allocationLimits,
    onViewUser,
    onViewRole,
    onDeleteUser,
    onRenameUser,
    setActiveUser,
    onDeleteRole,
    onUpdateRole,
    onAssignRole,
    onCloseModal,
    onToggleModal,
    onFetchingData,
    onCreateNewUser,
    onCreateNewRole,
    handleAssignRole,
    handleDeleteRole,
    handleDeleteUser,
    handleUpdateAuth,
    fetchAssignedRole,
    handleFlatingMenus,
    handleCreateNewRole,
    handleGetUserDetail,
    handleUpdateTrueName,
    fetchUserDetailMenus,
    fetchAllocationLitmit,
    handleCreateNewMember,
    handleCheckEmailLimit,
    handleGetRegisterLimit,
    handleAssignSpecialRole,
    handleUpdateManagingUser,
    handleGetPermissionRoles,
    handleGetAllocationLitmit,
    fetchUserDetailMenusByRole,
    onCreateNewRoleWithCurrentPermission,
  }
}
