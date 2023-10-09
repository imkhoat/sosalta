import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { RESPONSE_CODE } from '../services/utils/https-code'
import { httpsGetStorageUsage } from '../services/storage-services'
import { useUserStorageStore } from '../stores/user-storage-stores'

export default function useGeneral() {
  async function onGetUserStorage() {
    const { getUserName } = storeToRefs(useAuthStore())
    const { setUserStorage } = useUserStorageStore()

    if (!getUserName.value) {
      return
    }
    const response = await httpsGetStorageUsage({ userName: getUserName.value })

    if (response?.code === RESPONSE_CODE.SUCCESS) {
      setUserStorage(response.data)
    }
  }
  return {
    onGetUserStorage,
  }
}
