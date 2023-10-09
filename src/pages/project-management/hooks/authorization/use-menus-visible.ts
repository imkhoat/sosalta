import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { computed } from 'vue'

export function useMenusVisible() {
  const { getUserAuthorization, isMainAccount } = storeToRefs(useAuthStore())

  const _projectManagementFunctions = computed(() => {
    return getUserAuthorization.value.projectPage.functions
  })

  const _projectManagementMenus = computed(() => {
    return getUserAuthorization.value.projectPage.menus
  })

  const hasProjectFileMenuVisible = computed(() => {
    return _projectManagementMenus.value.entries.visible
  })

  const hasProjectSettingMenuVisible = computed(() => {
    return _projectManagementMenus.value.entries.visible
  })

  const hasProjectEntriesMenuVisible = computed(() => {
    return _projectManagementMenus.value.entries.visible
  })

  const hasProjectCreateActionVisible = computed(() => {
    return isMainAccount.value
  })

  const hasProjectDeleteActionVisible = computed(() => {
    return isMainAccount.value
  })

  return {
    hasProjectFileMenuVisible,
    hasProjectSettingMenuVisible,
    hasProjectEntriesMenuVisible,
    hasProjectCreateActionVisible,
    hasProjectDeleteActionVisible,
  }
}
