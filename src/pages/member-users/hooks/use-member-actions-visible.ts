import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { MemberUser } from 'src/core/types/services/user-types'
import { USER_ROLE } from 'src/core/types/user-role-types'
import { UserInfo } from 'src/core/types/user-info'

export function useActiveMemberActionsVisible() {
  const { isMainAccount, getMemberManagerList, getUserRole } = storeToRefs(
    useAuthStore()
  )

  const _hasMemberManagerRole = computed(() => {
    return (
      getUserRole.value &&
      (getUserRole.value === USER_ROLE.MEMBER_MANAGER ||
        getUserRole.value === USER_ROLE.MEMBER_PAYMENT_MANAGER)
    )
  })
  function _hasMemberRoleOnTargetMember(targetMember: MemberUser | UserInfo) {
    return (
      getUserRole.value &&
      _hasMemberManagerRole.value &&
      getMemberManagerList.value?.some((item) => {
        return ['all'].includes(item) || targetMember.userName === item
      })
    )
  }

  const hasCreateMemberAuthorization = computed(() => {
    return isMainAccount.value || _hasMemberManagerRole.value
  })

  const hasAssignMemberAuthorization = computed(() => {
    return isMainAccount.value || _hasMemberManagerRole.value
  })

  const hasDeleteRoleMemberAuthorization = computed(() => {
    return isMainAccount.value || _hasMemberManagerRole.value
  })

  const hasEditRoleMemberAuthorization = computed(() => {
    return isMainAccount.value || _hasMemberManagerRole.value
  })

  const hasCreateRoleMemberAuthorization = computed(() => {
    return isMainAccount.value || _hasMemberManagerRole.value
  })

  function hasDeleteMemberAuthorization(
    targetMember?: MemberUser | UserInfo | null
  ) {
    if (!targetMember) {
      return false
    }
    return isMainAccount.value || _hasMemberRoleOnTargetMember(targetMember)
  }

  function hasEditMemberAuthorization(
    targetMember?: MemberUser | UserInfo | null
  ) {
    if (!targetMember) {
      return false
    }
    return isMainAccount.value || _hasMemberRoleOnTargetMember(targetMember)
  }

  return {
    hasEditMemberAuthorization,
    hasDeleteMemberAuthorization,
    hasEditRoleMemberAuthorization,
    hasCreateRoleMemberAuthorization,
    hasDeleteRoleMemberAuthorization,
    hasAssignMemberAuthorization,
    hasCreateMemberAuthorization,
  }
}
