import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import {
  AuthLimit,
  UserDataVo,
  userSubscription,
} from 'src/core/types/order-record-type'
import useCapacityDrive from 'src/core/composables/use-capacity-drive'

export const useMemberCenterStore = defineStore('member-center', () => {
  const { convertToByte } = useCapacityDrive()

  // state
  const authLimit = useStorage(
    'member-center-authLimit',
    {} as AuthLimit,
    sessionStorage
  )
  const userDataVo = useStorage(
    'member-center-userDataVo',
    {} as UserDataVo,
    sessionStorage
  )
  const userSubscription = useStorage(
    'member-center-userSubscription',
    {} as userSubscription,
    sessionStorage
  )

  //getters
  const getAuthLimit = computed(() => {
    return authLimit.value
  })

  const getUserDataVo = computed(() => {
    return {
      ...userDataVo.value,
      maxStorageCapacity: convertToByte(
        authLimit.value?.maxStorageCapacity,
        'GB'
      ),
    }
  })

  const getUserSubscription = computed(() => {
    return userSubscription.value
  })

  const totalUsageStorage = computed(() => {
    return (
      userDataVo.value?.userStorageCapacity +
      userDataVo.value?.userDataDriverCapacity +
      userDataVo.value?.userDeveloperCenterCapacity +
      userDataVo.value?.userGroupCapacity +
      userDataVo.value?.userProjectCapacity
    )
  })

  const remaingStorageCapacity = computed(() => {
    return getUserDataVo.value?.maxStorageCapacity - totalUsageStorage.value
  })

  const totalStorage = computed(() => {
    return getUserDataVo.value?.maxStorageCapacity
  })

  // actions
  function setAuthLimit(payload: AuthLimit) {
    authLimit.value = payload
  }

  function setUserDataVo(payload: UserDataVo) {
    userDataVo.value = payload
  }

  function setUserSubscription(payload: userSubscription) {
    userSubscription.value = payload
  }

  return {
    totalStorage,
    getAuthLimit,
    getUserDataVo,
    totalUsageStorage,
    getUserSubscription,
    remaingStorageCapacity,
    setAuthLimit,
    setUserDataVo,
    setUserSubscription,
  }
})
