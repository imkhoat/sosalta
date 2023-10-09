import {
  httpsGetUserList,
  httpsDeleteTeams,
  httpsCreateNewTeam,
  httpsGetTeamDetail,
  httpsChangeTeamName,
  httpsGetGroupOwners,
  httpsGetTeamGroupList,
} from 'src/core/services/user-services'
import { format } from 'date-fns'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Team } from 'src/core/types/team-types'
import { UserInfo } from 'src/core/types/user-info'
import { useAuthStore } from 'src/core/stores/auth'
import { errorHandler } from 'src/core/utils/error-handler'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { TEAM_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'
import { CreateNewTeamRequest } from 'src/core/types/services/user-types'
import { TablePagination } from 'src/core/types/pagging-types'
import { usePaginationStore } from 'src/core/stores/pagination'
import { useSearchStore } from 'src/core/stores/search'
import { useTeamStore } from 'src/core/stores/teams'

const modal = reactive<{
  open: boolean
  type:
    | 'VIEW_TEAM_FILES'
    | 'VIEW_TEAM_MEMBERS'
    | 'DELETE_TEAM_MODAL'
    | 'DELETE_TEAMS_MODAL'
    | 'NEW_TEAM_MEMBERS'
    | 'RENAME_TEAM_MODAL'
}>({
  open: false,
  type: 'VIEW_TEAM_FILES',
})
const activeTeam = ref<Team | null>(null)
const selectTeams = ref<Team[]>([])

export function useTeams() {
  // composable
  const $q = useQuasar()
  const { t } = useI18n()
  const router = useRouter()
  const { getUserInformation } = storeToRefs(useAuthStore())
  const { pagination } = storeToRefs(usePaginationStore())
  const { searchKeyword } = storeToRefs(useSearchStore())
  const { resetSearchKeyword } = useSearchStore()
  const { updatePagination, resetPagination } = usePaginationStore()
  const { setActiveTeam } = useTeamStore()

  //reset state
  resetPagination()
  resetSearchKeyword()

  // data
  const teams = ref<Team[]>([])
  const teamMembers = ref<UserInfo[]>()
  const owners = ref<string[]>([])
  const loading = ref(false)

  // methods
  function onCloseModal() {
    modal.open = false
  }

  function onCreateNewTeam() {
    modal.open = true
    modal.type = 'NEW_TEAM_MEMBERS'
  }

  function onRenameNewTeam(team: Team | null) {
    activeTeam.value = team
    setActiveTeam(team)
    modal.open = true
    modal.type = 'RENAME_TEAM_MODAL'
  }

  function onViewTeamMembers(team: Team | null) {
    activeTeam.value = team
    setActiveTeam(team)
    router.push({
      name: TEAM_MANAGEMENT_ROUTE_NAMES.MEMBERS,
      params: { teamId: activeTeam.value?.groupId },
    })
  }

  function onViewTeamFiles(team: Team | null) {
    activeTeam.value = team
    setActiveTeam(team)
    router.push({
      name: TEAM_MANAGEMENT_ROUTE_NAMES.FILES,
      params: { teamId: activeTeam.value?.groupId },
    })
  }

  function onViewTeamInfo(team: Team | null) {
    activeTeam.value = team
    console.log('onViewTeamInfo', team?.managerUser)
    setActiveTeam(team)
    router.push({
      name: TEAM_MANAGEMENT_ROUTE_NAMES.SETTINGS,
      params: { teamId: activeTeam.value?.groupId },
    })
  }

  function onDeleteTeam(team: Team | null) {
    activeTeam.value = team
    setActiveTeam(team)
    modal.open = true
    modal.type = 'DELETE_TEAM_MODAL'
  }

  function onDeleteTeams() {
    modal.open = true
    modal.type = 'DELETE_TEAMS_MODAL'
  }

  function onToggleModal() {
    modal.open = !modal.open
  }

  async function fetchTeamList(
    currentPaging?: TablePagination,
    keyword?: string,
    owner?: string
  ) {
    try {
      loading.value = true

      const data = await httpsGetTeamGroupList({
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        page: currentPaging?.page ?? pagination.value?.page,
        search: keyword ?? searchKeyword.value,
        owner: owner,
      })

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        teams.value =
          data?.data?.list.map((team) => {
            return _transformTeamData(team)
          }) ?? []

        updatePagination({
          rowsPerPage: data?.data.pageSize,
          page: data?.data?.currPage,
          rowsNumber: data?.data?.totalCount,
        })
      }
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function fetchGroupOwner() {
    try {
      loading.value = true

      const data = await httpsGetGroupOwners()

      console.log(data)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data ?? []
      }
      return []
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchTeamMembers() {
    try {
      loading.value = true
      const data = await httpsGetUserList()

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        teamMembers.value =
          data?.data.map((user) => {
            return {
              id: user.userName,
              ...user,
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

  async function handleDeleteActiveTeam() {
    try {
      if (!activeTeam.value) {
        $q.notify({
          message: t(
            `pages.teamManagement.entries.Please select team to delete`
          ),
          type: 'negative',
        })
        return
      }
      loading.value = true

      const params = [activeTeam?.value?.groupId]
      const data = await httpsDeleteTeams(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t(`pages.teamManagement.entries.Delete success`),
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleDeleteSelectedTeam() {
    try {
      if (selectTeams.value?.length === 0) {
        $q.notify({
          message: t(
            `pages.teamManagement.entries.Please select team to delete`
          ),
          type: 'negative',
        })
        return
      }
      loading.value = true

      const params = selectTeams?.value?.map((item) => item.groupId)
      const data = await httpsDeleteTeams(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t(`pages.teamManagement.entries.Delete success`),
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleCreateNewTeam(name: string) {
    try {
      if (!getUserInformation.value.userName) {
        $q.notify({
          message: t(`pages.teamManagement.entries.Please login first`),
          type: 'negative',
        })
        return
      }

      loading.value = true

      const payload: CreateNewTeamRequest = {
        groupName: name,
        userNameItem: {
          trueName: JSON.stringify(getUserInformation.value.trueName ?? ''),
          userName: getUserInformation.value.userName,
        },
      }

      const data = await httpsCreateNewTeam(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleChangeTeamName(
    teamId: string | undefined,
    teamName: string | undefined
  ) {
    try {
      if (!teamId || !teamName) {
        $q.notify({
          message: t(`pages.teamManagement.entries.Field required`),
          type: 'negative',
        })
        return
      }

      loading.value = true

      const data = await httpsChangeTeamName(teamId, teamName)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleGetTeamDetail(teamId: string | undefined) {
    try {
      if (!teamId) {
        $q.notify({
          message: t(`pages.teamManagement.entries.Please select team`),
          type: 'negative',
        })
        return
      }

      loading.value = true

      const data = await httpsGetTeamDetail(teamId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        activeTeam.value = {
          ...activeTeam.value,
          ..._transformTeamData(data?.data.groupNameItem),
        }
        setActiveTeam(activeTeam.value)
      }
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  function _transformTeamData(team: Team) {
    return {
      id: team.groupId,
      ...team,
      gmtCreateAtString: format(
        new Date(team.gmtCreate || ''),
        'MMM dd, yyyy'
      ).toString(),
      gmtUpdateAtString: format(
        new Date(team.gmtUpdate || ''),
        'MMM dd, yyyy'
      ).toString(),
    }
  }

  return {
    modal,
    teams,

    loading,
    pagination,
    activeTeam,
    teamMembers,
    selectTeams,
    searchKeyword,
    onCloseModal,
    onDeleteTeam,
    fetchTeamList,
    onToggleModal,
    onDeleteTeams,
    onViewTeamInfo,
    fetchGroupOwner,
    onViewTeamFiles,
    onRenameNewTeam,
    onCreateNewTeam,
    fetchTeamMembers,
    updatePagination,
    onViewTeamMembers,
    handleGetTeamDetail,
    handleCreateNewTeam,
    handleChangeTeamName,
    handleDeleteActiveTeam,
    handleDeleteSelectedTeam,
  }
}
