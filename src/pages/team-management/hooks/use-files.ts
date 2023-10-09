import { httpsGetTeamUserGroupAuth } from 'src/core/services/team-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { useTeamStore } from 'src/core/stores/teams'
import { ref } from 'vue'

export function useTeamFiles() {
  // composalbe
  const { setFlatUserMenus } = useTeamStore()
  const loading = ref(false)

  async function handleGetUserTeamAuth(groupId: string) {
    try {
      loading.value = true

      const data = await httpsGetTeamUserGroupAuth(groupId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        setFlatUserMenus(data?.data)
      }

      return false
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    handleGetUserTeamAuth,
  }
}
