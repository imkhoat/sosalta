<template>
  <div
    class="column items-stretch justify-start full-height no-wrap member-settings-page"
  >
    <q-page-header
      :title="$t(`pages.memberUsers.Member user management`)"
      :subtitle="
        $t(
          `pages.memberUsers.Manager your team member and their account permission here`
        )
      "
    >
      <template v-slot:action>
        <member-users-actions></member-users-actions>
      </template>
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <member-users-table :users="users"></member-users-table>
  </div>
  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    class="member-settings-page__dialog"
  >
    <q-skeleton-suspense>
      <member-users-new-user-card
        v-if="modal.type === 'NEW_MEMBER_MODAL'"
        @close="onToggleModal"
        @refresh="onFetchingData"
      ></member-users-new-user-card>
      <member-users-delete-card
        v-if="modal.type === 'DELETE_ACTIVE_MODAL'"
        :user="activeUser"
        delete-type="DELETE_ACTIVE_MODAL"
        @close="onToggleModal"
        @refresh="onFetchingData"
      ></member-users-delete-card>
      <member-role-delete-card
        v-if="modal.type === 'DELETE_ROLE_MODAL'"
        @close="onToggleModal"
        @refresh="onFetchingData"
      ></member-role-delete-card>
      <member-users-new-role-card
        v-if="
          modal.type === 'NEW_ROLE_MODAL' ||
          modal.type === 'NEW_ROLE_WITH_EXIST_PERMISSION_MODAL' ||
          modal.type === 'UPDATE_ROLE_MODAL'
        "
        :type="modal.type"
        @close="onToggleModal"
        @refresh="onFetchingData"
      ></member-users-new-role-card>
      <member-users-assign-role-card
        v-if="modal.type === 'ASSIGN_ROLE_MODAL'"
        @close="onToggleModal"
        @refresh="onFetchingData"
      ></member-users-assign-role-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { computed, defineAsyncComponent } from 'vue'
import { useMemberSettings } from 'src/pages/member-users/hooks/use-member-settings'
import MemberUsersTable from 'src/pages/member-users/components/member-users-table.vue'
import MemberUsersActions from 'src/pages/member-users/components/member-users-actions.vue'

const MemberUsersDeleteCard = defineAsyncComponent(
  () => import('src/pages/member-users/components/member-users-delete-card.vue')
)
const MemberUsersNewUserCard = defineAsyncComponent(
  () =>
    import('src/pages/member-users/components/member-users-new-user-card.vue')
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
const MemberUsersAssignRoleCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/member-users/components/role/member-users-assign-role-card.vue'
    )
)

// composables
const $q = useQuasar()
const { modal, users, activeUser, onToggleModal, onFetchingData } =
  useMemberSettings()

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

onFetchingData()
</script>
