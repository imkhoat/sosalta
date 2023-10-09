import { useQuasar } from 'quasar'
import { format } from 'date-fns'
import {
  httpsDeleteNotifications,
  httpsGetUserNotifications,
  httpsMarkReadAllNotifications,
  httpsUpdateNotificationFlag,
} from 'src/core/services/user-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { errorHandler } from 'src/core/utils/error-handler'
import { reactive, ref } from 'vue'
import {
  SHARE_FILE_STATUS,
  ShareFileStatus,
  UserNotification,
} from 'src/core/types/use-notification-types'
import { ShareObjectRequest } from 'src/core/types/services/storage-types'
import { httpsShareObject } from 'src/core/services/storage-services'
import { StorageFile } from 'src/core/types/file-types'

const modal = reactive<{
  open: boolean
  type:
    | 'VIEW_RECEIVED_FILES_NOTIFICATION'
    | 'VIEW_UNREAD_FILES_NOTIFICATION'
    | 'VIEW_REGISTER_NOTIFICATION'
    | 'SHOW_EDIT_FILE_NAME'
}>({
  open: false,
  type: 'VIEW_RECEIVED_FILES_NOTIFICATION',
})
const selectedNotification = ref<UserNotification>()
const file = ref<StorageFile>()
export function useNotifications() {
  const loading = ref(false)

  const $q = useQuasar()

  // methods

  function onCloseModal() {
    modal.open = false
  }

  function onShowEditFileName() {
    modal.type = 'SHOW_EDIT_FILE_NAME'
    modal.open = true
  }

  function onShowDetailModal(item: UserNotification) {
    selectedNotification.value = item
    if (item?.type === 'register') {
      modal.type = 'VIEW_REGISTER_NOTIFICATION'
    } else if (item?.shareFileStatus === SHARE_FILE_STATUS.WAITING) {
      modal.type = 'VIEW_UNREAD_FILES_NOTIFICATION'
    } else {
      modal.type = 'VIEW_RECEIVED_FILES_NOTIFICATION'
    }

    modal.open = true
  }

  async function handleFetchUserNotifications(payload: {
    event: 'all' | 'read' | 'unRead'
    limit: number
  }) {
    try {
      loading.value = true
      const data = await httpsGetUserNotifications(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data?.items?.map((item) => {
          return {
            ...item,
            contentFormated: JSON.parse(item?.content) as {
              fileId: string
              fileName: string
              fileSize: string | number
              registerContent: string
            },
            createdTimeString: item?.createdTime
              ? format(
                  Number(item?.createdTime) * 1000,
                  'MMM dd, yyyy HH:mm'
                ).toString()
              : '',
          }
        })
      }

      return []
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }
  async function handleMarkAsReadAllNotifications(payload: string[]) {
    try {
      const data = await httpsMarkReadAllNotifications(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Marked as read',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }
  async function handleDeleteNotifications(payload: string[]) {
    try {
      const data = await httpsDeleteNotifications(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Delete successfull',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }
  async function handleUpdateNotificationFlag(payload: {
    msgId: string
    status?: ShareFileStatus
  }) {
    try {
      const data = await httpsUpdateNotificationFlag(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }
  async function handleReceiveFile(payload: ShareObjectRequest) {
    try {
      const data = await httpsShareObject(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Received file successfull',
          type: 'positive',
        })
        return true
      } else {
        file.value = data?.data[0]
        return false
      }
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  return {
    modal,
    loading,
    file,
    selectedNotification,
    onCloseModal,
    handleReceiveFile,
    onShowDetailModal,
    onShowEditFileName,
    handleDeleteNotifications,
    handleFetchUserNotifications,
    handleUpdateNotificationFlag,
    handleMarkAsReadAllNotifications,
  }
}
