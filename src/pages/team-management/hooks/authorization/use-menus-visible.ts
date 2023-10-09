import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { computed } from 'vue'

export function useMenusVisible() {
  const { getUserAuthorization, isMainAccount } = storeToRefs(useAuthStore())

  const _teamManagementFunctions = computed(() => {
    return getUserAuthorization.value.teamPage.functions
  })

  const _teamManagementMenus = computed(() => {
    return getUserAuthorization.value.teamPage.menus
  })

  const hasTeamFileMenuVisible = computed(() => {
    return _teamManagementMenus.value.teamFiles.visible
  })

  const hasTeamSettingMenuVisible = computed(() => {
    return _teamManagementMenus.value.teamSettings.visible
  })

  const hasTeamEntriesMenuVisible = computed(() => {
    return _teamManagementMenus.value.entries.visible
  })

  const hasTeamCreateActionVisible = computed(() => {
    return isMainAccount.value
  })

  const hasTeamDeleteActionVisible = computed(() => {
    return isMainAccount.value
  })

  return {
    hasTeamFileMenuVisible,
    hasTeamSettingMenuVisible,
    hasTeamEntriesMenuVisible,
    hasTeamCreateActionVisible,
    hasTeamDeleteActionVisible,
  }
}
