<template>
  <q-card
    flat
    class="member-users-table full-width"
  >
    <q-card-section>
      <div
        class="member-users-header__title column justify-center items-start q-mb-md"
      >
        <strong class="title text-subtitle1 text-weight-bold"
          >Member list</strong
        >
        <span class="subtitle text-caption text-disable"
          >Use checkbox to select member and click button to edit.</span
        >
      </div>
      <member-users-filter
        v-model:model-filter="search.filter"
        v-model="search.keyword"
      ></member-users-filter>
    </q-card-section>
    <q-card-section>
      <q-table
        selection="multiple"
        flat
        bordered
        muti
        class="full-width"
        :columns="columns"
        :rows="filtedUsers"
        :loading="loading"
        v-model:selected="selectUsers"
      >
        <template v-slot:body-cell-user_name="props">
          <q-td
            :props="props"
            class="cursor-pointer"
          >
            <div class="row justify-start items-center no-wrap">
              <q-avatar
                size="lg"
                color="grey-1"
              >
                <q-avatar
                  size="md"
                  color="grey-3"
                  icon="person"
                ></q-avatar>
              </q-avatar>
              <div class="column justify-start items-start q-ml-xs">
                <strong>{{ props.row.userName }}</strong>
                <span class="text-caption text-disable">{{
                  props.row.email
                }}</span>
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-user_role="props">
          <q-td :props="props">
            <q-chip
              outline
              :color="props.row.roleName === 'orgUser' ? 'primary' : 'positive'"
              size="sm"
              class="text-weight-bold text-body2"
              >{{ props.row.roleNameString }}</q-chip
            >
          </q-td>
        </template>
        <template v-slot:body-cell-user_action="props">
          <q-td :props="props">
            <div>
              <q-btn
                v-if="hasDeleteMemberAuthorization(props.row)"
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onDeleteUser(props.row)"
              >
                <q-icon name="sym_o_delete"></q-icon>
              </q-btn>
              <q-btn
                v-if="hasEditMemberAuthorization(props.row)"
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onViewUser(props.row)"
              >
                <q-icon name="sym_o_edit"></q-icon>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { QTableColumn } from 'quasar'
import MemberUsersFilter from 'src/pages/member-users/components/member-users-filter.vue'
import { UserInfo } from 'src/core/types/user-info'
import { useMemberSettings } from 'src/pages/member-users/hooks/use-member-settings'
import { useActiveMemberActionsVisible } from '../hooks/use-member-actions-visible'
// composables
const { onDeleteUser, onViewUser, loading, selectUsers } = useMemberSettings()
const { hasDeleteMemberAuthorization, hasEditMemberAuthorization } =
  useActiveMemberActionsVisible()
// props & emits
const props = defineProps<{
  users: UserInfo[] | undefined
}>()
// data
const search = reactive({
  filter: '',
  keyword: '',
})

const columns: QTableColumn[] = [
  {
    name: 'user_name',
    field: 'name',
    label: 'Name',
    classes: 'user-column user-column__name',
    headerClasses: 'user-column-header user-column-header__name',
    required: true,
    align: 'left',
  },
  {
    name: 'user_role',
    field: 'role',
    label: 'Role',
    classes: 'user-column user-column__user-role',
    headerClasses: 'user-column-header user-column-header__user-role',
    required: true,
    align: 'left',
  },
  {
    name: 'create_at',
    field: 'gmtCreateAtString',
    label: 'Date added',
    classes: 'user-column user-column__date-create',
    headerClasses: 'user-column-header user-column-header__date-create',
    required: true,
    align: 'left',
  },
  {
    name: 'update_at',
    field: 'gmtUpdateString',
    label: 'Last active',
    classes: 'user-column user-column__last-updated',
    headerClasses: 'user-column-header user-column-header__last-updated',
    required: true,
    align: 'left',
  },
  {
    name: 'user_action',
    field: 'user_action',
    label: '',
    classes: 'user-column user-column__action',
    headerClasses: 'user-column-header user-column-header__action',
    required: true,
    align: 'right',
  },
]

// computed

const filtedUsers = computed(() => {
  return props.users
    ?.filter((user) => {
      return `${user.userName}-${user.email}-${user.trueName?.firstName}-${user.trueName?.lastName}-${user.roleNameString}`
        .toLowerCase()
        .includes(search.keyword.toLowerCase())
    })
    .filter((user) => {
      return !search.filter || user.roleName === search.filter
    })
})

// methods
</script>
<style lang="scss">
.member-users-table {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }
}
</style>
