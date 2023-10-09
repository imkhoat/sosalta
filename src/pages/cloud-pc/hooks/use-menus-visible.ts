import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { computed } from 'vue'

export function useMenusVisible() {
  const { getUserAuthorization } = storeToRefs(useAuthStore())

  const _cloudPCFunctions = computed(() => {
    return getUserAuthorization.value.cloudPCPage.functions
  })

  const _cloudPCMenus = computed(() => {
    return getUserAuthorization.value.cloudPCPage.menus
  })

  const hasDataDriveMenuVisible = computed(() => {
    return _cloudPCMenus.value.dataDrive.visible
  })

  const hasCloudPCMenuVisible = computed(() => {
    return _cloudPCMenus.value.dataDrive.visible
  })

  const hasMachinePublicMenuVisible = computed(() => {
    return _cloudPCMenus.value.machinePublicImage.visible
  })

  const hasMachinePrivateMenuVisible = computed(() => {
    return _cloudPCMenus.value.machinePrivateImage.visible
  })

  const hasDataDriveCreateActionVisible = computed(() => {
    return _cloudPCFunctions.value.dataDriveCreate.visible
  })

  const hasDataDriveRenameActionVisible = computed(() => {
    return _cloudPCFunctions.value.dataDriveRename.visible
  })

  const hasDataDriveDeleteActionVisible = computed(() => {
    return _cloudPCFunctions.value.dataDriveDelete.visible
  })

  return {
    hasDataDriveMenuVisible,
    hasCloudPCMenuVisible,
    hasMachinePrivateMenuVisible,
    hasMachinePublicMenuVisible,
    hasDataDriveCreateActionVisible,
    hasDataDriveRenameActionVisible,
    hasDataDriveDeleteActionVisible,
  }
}
