<template>
  <q-btn
    size="sm"
    rounded
    round
    flat
    @click="toggleDrawer()"
  >
    <q-icon
      size="26px"
      name="sym_o_notifications_active"
    ></q-icon>
  </q-btn>
  <q-drawer
    v-model="drawer"
    :width="400"
    :breakpoint="500"
    overlay
    bordered
    side="right"
  >
    <notification-list
      :items="notifications"
      :loading="loading"
      @change="onFetchingData($event)"
      @mark-all="onMarkAsReadAll"
      @update-flag="onUpdateNotificationFlag"
      @delete-all="onDeleteAll"
      @show-detail="onShowDetailModal"
      @delete-selected="onDeleteSelectedNotifications"
      @close="toggleDrawer"
    ></notification-list>
  </q-drawer>
  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    class="the-notification-drawer__dialog"
  >
    <q-skeleton-suspense>
      <notification-register-card
        :item="selectedNotification"
        v-if="modal.type === 'VIEW_REGISTER_NOTIFICATION'"
        @close="onCloseModal"
        @refresh="onFetchingData"
        @delete="onDeleteSingleNotification"
      ></notification-register-card>
      <notification-file-rename-card
        :item="selectedNotification"
        :file="file"
        v-else-if="modal.type === 'SHOW_EDIT_FILE_NAME'"
        @close="onCloseModal"
        @refresh="onFetchingData"
        @delete="onDeleteSingleNotification"
      ></notification-file-rename-card>
      <notification-file-unread-card
        :item="selectedNotification"
        v-else-if="modal.type === 'VIEW_UNREAD_FILES_NOTIFICATION'"
        @close="onCloseModal"
        @refresh="onFetchingData"
        @delete="onDeleteSingleNotification"
      ></notification-file-unread-card>
      <notification-file-received-card
        :item="selectedNotification"
        v-else-if="modal.type === 'VIEW_RECEIVED_FILES_NOTIFICATION'"
        @close="onCloseModal"
        @refresh="onFetchingData"
        @delete="onDeleteSingleNotification"
      ></notification-file-received-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { UserNotification } from 'src/core/types/use-notification-types'
import { useNotifications } from 'src/pages/notification/hooks/use-notifications'
import NotificationList from 'src/pages/notification/components/notification-list.vue'

const NotificationFileReceivedCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/notification/components/notification-file-received-card.vue'
    )
)
const NotificationFileUnreadCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/notification/components/notification-file-unread-card.vue'
    )
)
const NotificationRegisterCard = defineAsyncComponent(
  () =>
    import('src/pages/notification/components/notification-register-card.vue')
)
const NotificationFileRenameCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/notification/components/notification-file-rename-card.vue'
    )
)
// data
const drawer = ref(false)
const curentTab = ref<'all' | 'read' | 'unRead'>('all')
const notifications = ref<UserNotification[]>([])

// composable
const $q = useQuasar()
const {
  modal,
  loading,
  file,
  selectedNotification,
  onCloseModal,
  onShowDetailModal,
  handleDeleteNotifications,
  handleFetchUserNotifications,
  handleUpdateNotificationFlag,
  handleMarkAsReadAllNotifications,
} = useNotifications()

//computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// methods
async function onFetchingData(event: 'all' | 'read' | 'unRead' = 'all') {
  curentTab.value = event
  notifications.value = await handleFetchUserNotifications({
    event,
    limit: 100,
  })
}

function toggleDrawer() {
  onFetchingData()
  drawer.value = !drawer.value
}

async function onMarkAsReadAll() {
  const payload = notifications.value.map((item) => {
    return item.id
  })
  await handleMarkAsReadAllNotifications(payload)
  onFetchingData(curentTab.value)
}

async function onDeleteAll() {
  const payload = notifications.value.map((item) => {
    return item.id
  })
  await handleDeleteNotifications(payload)
  onFetchingData(curentTab.value)
}

async function onDeleteSelectedNotifications(notis: UserNotification[]) {
  const payload = notis.map((item) => {
    return item.id
  })
  await handleDeleteNotifications(payload)
  onFetchingData(curentTab.value)
}

async function onDeleteSingleNotification() {
  if (selectedNotification.value?.id) {
    await handleDeleteNotifications([selectedNotification.value?.id])
    onFetchingData(curentTab.value)
  }
}

async function onUpdateNotificationFlag(item: UserNotification) {
  const payload = {
    msgId: item.id,
  }
  await handleUpdateNotificationFlag(payload)
  onFetchingData(curentTab.value)
}
</script>
