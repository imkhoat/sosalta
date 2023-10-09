import { i18n } from 'boot/i18n'
import { format } from 'date-fns'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/core/stores/auth'
import {
  AddSymmetricKeyRequest,
  CreateKeyManagerPasswordRequest,
  GetDecryptFileListRequest,
  UpdateUserMasterPasswordRequest,
  UploadSymmetricKeyRequest,
} from 'src/core/types/services/storage-types'
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  httpsGetDecryptFileList,
  httpsCreateKeyManagerPassword,
  httpsGetUserSymmetricKeyList,
  httpsUpdateUserMasterPassword,
  httpsAddSymmetricKey,
  httpsUploadSymmetricKey,
} from 'src/core/services/storage-services'
import { UserInfo } from 'src/core/types/user-info'
import { errorHandler } from 'src/core/utils/error-handler'
import { SymmetricKey } from 'src/core/types/symmetric-key'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'

const modal = reactive<{
  open: boolean
  type:
    | 'NEW_PASSWORD_MODAL'
    | 'VERIFY_PASSWORD_MODAL'
    | 'CHANGE_PASSWORD_MODAL'
    | 'CREATE_KEY_MODAL'
}>({
  open: true,
  type: 'VERIFY_PASSWORD_MODAL',
})

const masterPassword = ref('')

export function useKeyManager() {
  //composables
  const $q = useQuasar()
  const { t } = i18n.global
  const { setUserInfo } = useAuthStore()
  const { getDefaultRootFolder, getEncryptedFolderId } = storeToRefs(
    useFileSystemStore()
  )

  // local data
  const loading = ref(false)

  // methods
  function requestCreateMasterPassword() {
    modal.type = 'NEW_PASSWORD_MODAL'
    modal.open = true
  }

  function requestVerifyMasterPassword() {
    modal.type = 'VERIFY_PASSWORD_MODAL'
    modal.open = true
  }

  function requestChangeMasterPassword() {
    modal.type = 'CHANGE_PASSWORD_MODAL'
    modal.open = true
  }

  function requestCreateNewKey() {
    modal.type = 'CREATE_KEY_MODAL'
    modal.open = true
  }

  function setMasterPassword(payload: string) {
    masterPassword.value = payload
  }

  function closeModal() {
    modal.open = false
  }

  async function handleVerifyManagerPassword(masterPassword: string) {
    try {
      loading.value = true
      const params: GetDecryptFileListRequest = {
        masterPassword,
        parentId:
          getDefaultRootFolder.value.get(getEncryptedFolderId.value)?.id || '',
      }

      const data = await httpsGetDecryptFileList(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('pages.keyManager.notify.Verify manager password success'),
          type: 'positive',
        })
        setMasterPassword(masterPassword)
        return true
      }

      setMasterPassword('')
      return false
    } catch (error) {
      setMasterPassword('')
      return false
    } finally {
      loading.value = false
    }
  }

  async function handleCreateManagerPassword(masterPassword: string) {
    try {
      loading.value = true
      const params: CreateKeyManagerPasswordRequest = {
        keyLibPassword: masterPassword,
      }

      const data = await httpsCreateKeyManagerPassword(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('pages.keyManager.notify.Create master password success'),
          type: 'positive',
        })
        setUserInfo(data?.data as UserInfo)
        closeModal()
        return true
      }

      setMasterPassword('')
      return false
    } catch (error) {
      setMasterPassword('')
      return false
    } finally {
      loading.value = false
    }
  }

  async function handleChangeManagerPassword(
    masterPassword: string,
    newPassword: string
  ) {
    try {
      loading.value = true
      const params: UpdateUserMasterPasswordRequest = {
        masterPassword,
        newPassword,
      }

      const data = await httpsUpdateUserMasterPassword(params)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('pages.keyManager.notify.Change master password success'),
          type: 'positive',
        })
        setUserInfo(data?.data as UserInfo)
        setMasterPassword(newPassword)
        closeModal()
        return true
      }

      setMasterPassword('')
      return false
    } catch (error) {
      setMasterPassword('')
      return false
    } finally {
      loading.value = false
    }
  }

  async function handleGetUserSymmetricKeyList() {
    try {
      loading.value = true
      const data = await httpsGetUserSymmetricKeyList()

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data?.map((item: SymmetricKey) => {
          const createDate =
            item?.createdAt?.toString()?.length === 10
              ? new Date(parseInt(item?.createdAt.toString()) * 1000)
              : new Date(item?.createdAt)
          return {
            ...item,
            gmtCreateString: item?.createdAt
              ? format(createDate, 'MMM dd, yyyy HH:mm').toString()
              : '',
          }
        })
      }
    } catch (error) {
      errorHandler.log(error)
      return []
    } finally {
      loading.value = false
    }
  }

  async function handleAddSymmetricKey(
    masterPassword: string,
    keyName: string
  ) {
    try {
      loading.value = true
      const params: AddSymmetricKeyRequest = {
        masterPassword,
        name: keyName,
      }
      const data = await httpsAddSymmetricKey(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('pages.keyManager.notify.Add random key success'),
          type: 'positive',
        })
        return true
      }
      return false
    } catch (error) {
      errorHandler.log(error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function handleUploadSymmetricKey(
    masterPassword: string,
    keyName: string,
    keyValue: string
  ) {
    try {
      loading.value = true
      const params: UploadSymmetricKeyRequest = {
        masterPassword,
        keyName: keyName,
        symmetricKeyStr: keyValue,
      }
      const data = await httpsUploadSymmetricKey(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('pages.keyManager.notify.Upload key success'),
          type: 'positive',
        })
        return true
      }
      return false
    } catch (error) {
      errorHandler.log(error)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    modal,
    loading,
    masterPassword,
    closeModal,
    requestCreateNewKey,
    handleAddSymmetricKey,
    handleUploadSymmetricKey,
    requestCreateMasterPassword,
    requestVerifyMasterPassword,
    requestChangeMasterPassword,
    handleVerifyManagerPassword,
    handleCreateManagerPassword,
    handleChangeManagerPassword,
    handleGetUserSymmetricKeyList,
  }
}
