import { httpsGetProjectUserPermissionDetail } from 'src/core/services/project-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { useProjectStore } from 'src/core/stores/projects'
import { ref } from 'vue'

export function useProjectFiles() {
  // composalbe
  const { setFlatUserMenus } = useProjectStore()
  const loading = ref(false)

  async function handleGetUserProjectAuth(projectId: string, userName: string) {
    try {
      loading.value = true

      const data = await httpsGetProjectUserPermissionDetail(
        projectId,
        userName
      )

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
    handleGetUserProjectAuth,
  }
}
