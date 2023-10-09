import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { computed } from 'vue'

export function useMenusVisible() {
  const { getUserAuthorization } = storeToRefs(useAuthStore())

  const _accountSettingFunctions = computed(() => {
    return getUserAuthorization.value.accountSettings.functions
  })

  const hasAllowEditBasicInformation = computed(() => {
    return _accountSettingFunctions.value.allowEditBasicInformation.visible
  })

  return {
    hasAllowEditBasicInformation,
  }
}
