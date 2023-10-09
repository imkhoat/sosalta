import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { useTeamStore } from 'src/core/stores/teams'

export function useActiveTeamActionsVisible() {
  const { getActiveTeam } = storeToRefs(useTeamStore())
  const { isMainAccount } = storeToRefs(useAuthStore())

  const hasDeleteTeamAuthorization = computed(() => {
    return isMainAccount.value || getActiveTeam.value.managerUser
  })

  const hasCreateTeamAuthorization = computed(() => {
    return isMainAccount.value || getActiveTeam.value.managerUser
  })

  const hasViewTeamInfoAuthorization = computed(() => {
    return isMainAccount.value || getActiveTeam.value.managerUser
  })

  const hasViewTeamMembersAuthorization = computed(() => {
    return isMainAccount.value || getActiveTeam.value.managerUser
  })

  const hasEditTeamNameAuthorization = computed(() => {
    return isMainAccount.value || getActiveTeam.value.managerUser
  })

  const hasCreateTeamRoleAuthorization = computed(() => {
    return isMainAccount.value || getActiveTeam.value.managerUser
  })

  const hasEditTeamRoleAuthorization = computed(() => {
    return isMainAccount.value || getActiveTeam.value.managerUser
  })

  const hasDeleteTeamRoleAuthorization = computed(() => {
    return isMainAccount.value || getActiveTeam.value.managerUser
  })

  const hasAddTeamMemberAuthorization = computed(() => {
    return isMainAccount.value || getActiveTeam.value.managerUser
  })

  const hasDeleteTeamMemberAuthorization = computed(() => {
    return isMainAccount.value || getActiveTeam.value.managerUser
  })

  const hasAssignTeamMemberAuthorization = computed(() => {
    return isMainAccount.value || getActiveTeam.value.managerUser
  })

  const hasEditTeamMemberPermissionsAuthorization = computed(() => {
    return isMainAccount.value || getActiveTeam.value.managerUser
  })

  return {
    hasDeleteTeamAuthorization,
    hasCreateTeamAuthorization,
    hasViewTeamInfoAuthorization,
    hasViewTeamMembersAuthorization,
    hasEditTeamNameAuthorization,
    hasCreateTeamRoleAuthorization,
    hasEditTeamRoleAuthorization,
    hasDeleteTeamRoleAuthorization,
    hasAddTeamMemberAuthorization,
    hasDeleteTeamMemberAuthorization,
    hasAssignTeamMemberAuthorization,
    hasEditTeamMemberPermissionsAuthorization,
  }
}
