<template>
  <div
    class="column items-stretch justify-start full-height no-wrap member-settings-page"
  >
    <q-page-header
      title="Member user information"
      subtitle="View detail member user information and update member user name"
      :back="backAction"
    ></q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <member-users-information-card
      :user="activeUser"
      class="q-mb-md"
    ></member-users-information-card>
    <div class="row bg-white q-mb-lg rounded-borders">
      <member-users-role-card
        class="q-mb-md col-12 col-md-8 col-lg-6 col-xl-5"
      ></member-users-role-card>
    </div>
    <member-users-permission-card
      @refresh="emits('refresh')"
      @close="emits('close')"
    ></member-users-permission-card>
  </div>

  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    class="member-settings-page__dialog"
  >
    <q-skeleton-suspense>
      <member-users-delete-card
        v-if="modal.type === 'DELETE_ACTIVE_MODAL'"
        :user="activeUser"
        delete-type="DELETE_ACTIVE_MODAL"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></member-users-delete-card>
      <member-role-delete-card
        v-if="modal.type === 'DELETE_ROLE_MODAL'"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></member-role-delete-card>
      <member-users-new-role-card
        v-if="
          modal.type === 'NEW_ROLE_MODAL' ||
          modal.type === 'NEW_ROLE_WITH_EXIST_PERMISSION_MODAL' ||
          modal.type === 'UPDATE_ROLE_MODAL'
        "
        :type="modal.type"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></member-users-new-role-card>
      <member-users-rename-user-card
        v-if="modal.type === 'RENAME_MEMBER_MODAL'"
        :user="activeUser"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></member-users-rename-user-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { useMemberSettings } from '../hooks/use-member-settings'
import { Breadcrumb } from 'src/core/types/breadcrumb-types'
import MemberUsersRoleCard from 'src/pages/member-users/components/member-users-role-card.vue'
import MemberUsersPermissionCard from 'src/pages/member-users/components/member-users-permission-card.vue'
import MemberUsersInformationCard from 'src/pages/member-users/components/member-users-information-card.vue'
import { MEMBER_USERS_ROUTE_NAMES } from 'src/pages/member-users/router'

const MemberUsersDeleteCard = defineAsyncComponent(
  () => import('src/pages/member-users/components/member-users-delete-card.vue')
)
const MemberUsersRenameUserCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/member-users/components/member-users-rename-user-card.vue'
    )
)
const MemberRoleDeleteCard = defineAsyncComponent(
  () =>
    import('src/pages/member-users/components/role/member-role-delete-card.vue')
)
const MemberUsersNewRoleCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/member-users/components/role/member-users-new-role-card.vue'
    )
)

// props & emits
const emits = defineEmits(['close', 'refresh'])

// composables
const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const { activeUser, modal, onCloseModal, onFetchingData } = useMemberSettings()

// computed
const backAction = computed(() => {
  return {
    name: 'Back to user page',
    to: () => router.push({ name: MEMBER_USERS_ROUTE_NAMES.MEMBER_SETTINGS }),
    icon: 'r_keyboard_return',
  } as Breadcrumb
})
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
</script>
