import { format } from 'date-fns'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { reactive, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import {
  httpsGetTeamMembers,
  httpsGetTeamUserPermissionDetail,
  httpsGetTeamUsers,
  httpsUpdateTeamMembers,
  httpsUpdateTeamUserPermission,
} from 'src/core/services/user-services'
import {
  UpdateTeamMembersRequest,
  UpdateTeamUserPermissionRequest,
} from 'src/core/types/services/user-types'
import { useRoute, useRouter } from 'vue-router'
import { UserInfo } from 'src/core/types/user-info'
import { UserMenu } from 'src/core/types/user-menu'
import {
  TEAM_MEMBER_TYPE,
  TeamMember,
  TeamMemberType,
} from 'src/core/types/team-member-types'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { TEAM_MANAGEMENT_ROUTE_NAMES } from 'src/pages/team-management/router'
import { TeamPermissionCodeType } from 'src/core/types/team-permission-code-types'
import { storeToRefs } from 'pinia'
import { usePaginationStore } from 'src/core/stores/pagination'
import { useSearchStore } from 'src/core/stores/search'
import { TablePagination } from 'src/core/types/pagging-types'

const modal = reactive<{
  open: boolean
  type:
    | 'NEW_MEMBER_MODAL'
    | 'ASSIGN_ROLE_MODAL'
    | 'DELETE_MEMBER_MODAL'
    | 'DELETE_MEMBERS_MODAL'
}>({
  open: false,
  type: 'NEW_MEMBER_MODAL',
})
const selectUsers = ref<TeamMember[]>([])
const activeUser = useStorage<TeamMember>(
  'team-management-activeUser',
  {} as TeamMember,
  sessionStorage
)
const activeUserPermission = ref<Map<TeamPermissionCodeType, UserMenu[]>>(
  new Map<TeamPermissionCodeType, UserMenu[]>()
)

export function useTeamMembers() {
  // composables
  const $q = useQuasar()
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const loading = ref(false)
  const { pagination } = storeToRefs(usePaginationStore())
  const { searchKeyword } = storeToRefs(useSearchStore())
  const { resetSearchKeyword } = useSearchStore()
  const { resetPagination, updatePagination } = usePaginationStore()

  //reset state
  resetPagination()
  resetSearchKeyword()

  // methods
  function onCloseModal() {
    modal.open = false
  }
  function onDeleteMembers() {
    modal.type = 'DELETE_MEMBERS_MODAL'
    modal.open = true
  }
  function onDeleteMember(user: TeamMember | null) {
    if (!user) {
      throw new Error(t(`pages.teamManagement.entries.Selected user not exist`))
    }
    activeUser.value = user
    modal.type = 'DELETE_MEMBER_MODAL'
    modal.open = true
  }

  function onAddNewMember() {
    modal.type = 'NEW_MEMBER_MODAL'
    modal.open = true
  }

  function onAssignRole() {
    if (selectUsers?.value?.length === 0) {
      $q.notify({
        message: t(
          `pages.teamManagement.entries.Please select users to assign`
        ),
        type: 'negative',
      })
      return
    }
    modal.type = 'ASSIGN_ROLE_MODAL'
    modal.open = true
  }

  function onViewUser(user: TeamMember) {
    activeUser.value = user

    router.push({
      name: TEAM_MANAGEMENT_ROUTE_NAMES.MEMBERS_DETAIL,
      params: { ...route.params, userName: activeUser.value?.userName },
    })
  }

  async function handleAddNewMembers(
    members: TeamMember[] | UserInfo[],
    groupId: string
  ) {
    try {
      loading.value = true

      const payload: UpdateTeamMembersRequest = {
        deleteGroupUsers: [],
        addGroupUsers: members,
        groupId,
        updateGroupUsers: [],
      }

      const data = await httpsUpdateTeamMembers(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t(`pages.teamManagement.entries.Add new members success`),
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

  async function handleRemoveNewMembers(
    members: TeamMember[] | UserInfo[],
    groupId: string
  ) {
    try {
      loading.value = true

      const payload: UpdateTeamMembersRequest = {
        deleteGroupUsers: members,
        addGroupUsers: [],
        groupId,
        updateGroupUsers: [],
      }
      const data = await httpsUpdateTeamMembers(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t(`pages.teamManagement.entries.Add new members success`),
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

  async function handleFetchTeamMemberByTeamId(
    groupId: string,
    currentPaging?: TablePagination,
    keyword?: string
  ) {
    try {
      loading.value = true

      const data = await httpsGetTeamMembers({
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        page: currentPaging?.page ?? pagination.value?.page,
        groupId,
        userName: keyword,
      })

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        // updatePagination({
        //   rowsPerPage: data?.data.pageSize,
        //   page: data?.data?.currPage,
        //   rowsNumber: data?.data?.totalCount,
        // })

        return data?.data?.map((item) => {
          return {
            id: item.userName,
            ...item,
            gmtCreateString: format(
              new Date(item.gmtCreate || ''),
              'MMM dd, yyyy'
            ).toString(),
            gmtUpdateString: format(
              new Date(item.gmtUpdate || ''),
              'MMM dd, yyyy'
            ).toString(),
            managerString:
              Number(item?.type) === TEAM_MEMBER_TYPE.OWNER
                ? 'Owner'
                : Number(item?.type) === TEAM_MEMBER_TYPE.TEAM_MANAGER
                ? 'Team Manager'
                : 'Member',
          }
        })
      }
      return []
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchMemberList(teamId: string) {
    try {
      loading.value = true
      const data = await httpsGetTeamUsers(teamId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data.data.map((item) => {
          return {
            ...item,
            groupId: teamId,
          }
        })
      }
      return [] as UserInfo[]
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchUserDetailMenusByUser(groupId: string, userName: string) {
    let menus = new Map<TeamPermissionCodeType, UserMenu[]>()

    try {
      loading.value = true
      const data = await httpsGetTeamUserPermissionDetail(groupId, userName)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        const checkingDatas = handleFormatPermissionByAdmin(data?.data)
        menus = handleFlatingMenus(checkingDatas)
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
      return menus
    }
  }

  async function handleGetTeamUserPermissionDetail(
    groupId: string,
    userName: string
  ) {
    try {
      activeUserPermission.value = await fetchUserDetailMenusByUser(
        groupId,
        userName
      )
    } catch (error) {
      throw error
    }
  }

  async function handleUpdateTeamUserPermission(
    payload: UpdateTeamUserPermissionRequest
  ) {
    try {
      loading.value = true
      const data = await httpsUpdateTeamUserPermission(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t(
            `pages.teamManagement.entries.Update user permission success`
          ),
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

  function handleFlatingMenus(menus: UserMenu[] | undefined) {
    const menuMap = new Map<TeamPermissionCodeType, UserMenu[]>()
    menus?.forEach((menu) => {
      if (menu?.authType) {
        const currentMenus = menuMap.get(menu.authType)?.values() ?? []
        menuMap.set(menu.authType, [
          ...currentMenus,
          { ...menu, title: menu.name },
        ])
      }
    })

    return menuMap
  }

  function handleFormatPermissionByAdmin(menus: UserMenu[]) {
    if (activeUser.value?.manager) {
      return menus.map((item) => {
        return { ...item, checked: true }
      })
    }
    return menus
  }

  return {
    modal,
    loading,
    activeUser,
    pagination,
    selectUsers,
    searchKeyword,
    activeUserPermission,
    onViewUser,
    onCloseModal,
    onAssignRole,
    onAddNewMember,
    onDeleteMember,
    onDeleteMembers,
    updatePagination,
    fetchMemberList,
    handleAddNewMembers,
    handleRemoveNewMembers,
    handleFetchTeamMemberByTeamId,
    handleUpdateTeamUserPermission,
    handleGetTeamUserPermissionDetail,
  }
}
