import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { BitUnit, BIT_UNIT } from 'src/core/types/unit-type'
import { UserStorage } from 'src/core/types/user-storage-types'
import useCapacityDrive from 'src/core/composables/use-capacity-drive'

export const useUserStorageStore = defineStore('user-storage', () => {
  //state
  const _loggedInUserStorage = ref<UserStorage>()

  // getter
  const getRemainingStorage = computed(() => {
    return _loggedInUserStorage.value?.availableToUseForCurrentUser ?? 0
  })

  const getCurrentUserStorageUsed = computed(() => {
    return _loggedInUserStorage.value?.currentUserStorageUsed ?? 0
  })

  const getUserStorageUnit = computed(() => {
    return _loggedInUserStorage.value?.storageValueUnit.toUpperCase() as BitUnit
  })

  const getTotalUserStorage = computed(() => {
    return getCurrentUserStorageUsed.value + getRemainingStorage.value
  })

  const getRemainingStorageByPercent = computed<number>(() => {
    return Number(
      ((getRemainingStorage.value / getTotalUserStorage.value) * 100).toFixed(2)
    )
  })

  const getRemainingStorageByPercentText = computed(() => {
    return `${getRemainingStorageByPercent.value}%`
  })

  const getCapacityStorageByGB = computed(() => {
    const { convertCapacity } = useCapacityDrive()
    const usedStorage = convertCapacity(
      getCurrentUserStorageUsed.value,
      getUserStorageUnit.value,
      BIT_UNIT.GB
    ).toFixed(2)
    const totalStorage = convertCapacity(
      getTotalUserStorage.value,
      getUserStorageUnit.value,
      BIT_UNIT.GB
    ).toFixed(2)
    return `${usedStorage}GB / ${totalStorage}GB`
  })

  // action
  function setUserStorage(payload: UserStorage) {
    _loggedInUserStorage.value = payload
  }
  return {
    getRemainingStorage,
    getUserStorageUnit,
    getTotalUserStorage,
    getCapacityStorageByGB,
    getCurrentUserStorageUsed,
    getRemainingStorageByPercent,
    getRemainingStorageByPercentText,
    setUserStorage,
  }
})
