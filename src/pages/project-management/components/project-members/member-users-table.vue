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
        v-model="searchKeyword"
        @search="onSearching"
        @select="emits('select', $event)"
      ></member-users-filter>
    </q-card-section>
    <q-card-section>
      <q-table
        ref="projectMemberTableRef"
        selection="multiple"
        flat
        bordered
        muti
        class="full-width"
        :columns="columns"
        :rows="clientSearchUsers"
        :loading="loading"
        v-model:pagination="pagination"
        v-model:selected="selectUsers"
        @request="onPaginationRequest"
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
              :color="props.row.managerUser ? 'positive' : 'primary'"
              size="sm"
              class="text-weight-bold text-body2"
              >{{ props.row.managerString }}</q-chip
            >
          </q-td>
        </template>
        <template v-slot:body-cell-user_action="props">
          <q-td :props="props">
            <div>
              <q-btn
                v-if="hasDeleteProjectMemberAuthorization"
                :disable="handleDisableManipulationAction(props.row)"
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onDeleteMember(props.row)"
              >
                <q-icon name="sym_o_delete"></q-icon>
              </q-btn>
              <q-btn
                v-if="hasAssignProjectMemberAuthorization"
                :disable="handleDisableManipulationAction(props.row)"
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
        <template v-slot:top-row>
          <q-tr v-if="disableManipulationOwnerAction">
            <q-td colspan="100%">
              <q-alert type="warning">
                You do not have the right to edit or delete the creator of this
                project
              </q-alert>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { QTableColumn } from 'quasar'
import { useAuthStore } from 'src/core/stores/auth'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  PROJECT_MEMBER_TYPE,
  ProjectMember,
} from 'src/core/types/project-member-types'
import { useProjectMembers } from 'src/pages/project-management/hooks/use-members'
import MemberUsersFilter from 'src/pages/project-management/components/project-members/member-users-filter.vue'
import { useActiveProjectActionsVisible } from 'src/pages/project-management/hooks/authorization/use-project-actions-visible'

// composables
const { isMainAccount } = storeToRefs(useAuthStore())
const { pagination, searchKeyword, onDeleteMember, onViewUser, selectUsers } =
  useProjectMembers()
const {
  hasDeleteProjectMemberAuthorization,
  hasAssignProjectMemberAuthorization,
} = useActiveProjectActionsVisible()
// props & emits
const props = defineProps<{
  users: ProjectMember[] | undefined
  loading: boolean
}>()
const emits = defineEmits(['request', 'search', 'select'])

// data
const clientSearchUsers = ref(props.users)
const projectMemberTableRef = ref()
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
    field: 'manager',
    label: 'Role',
    classes: 'user-column user-column__user-role',
    headerClasses: 'user-column-header user-column-header__user-role',
    required: true,
    align: 'left',
  },
  {
    name: 'create_at',
    field: 'gmtCreateString',
    label: 'Date added',
    classes: 'user-column user-column__date-create',
    headerClasses: 'user-column-header user-column-header__date-create',
    required: true,
    align: 'left',
  },
  {
    name: 'user_action',
    field: 'user_action',
    label: 'Action',
    classes: 'user-column user-column__action',
    headerClasses: 'user-column-header user-column-header__action',
    required: true,
    align: 'right',
  },
]

// computed
const hasOwnerInclude = computed(() => {
  return selectUsers.value?.some(
    (item) => item.type === PROJECT_MEMBER_TYPE.OWNER
  )
})

const disableManipulationOwnerAction = computed(() => {
  return !isMainAccount.value && hasOwnerInclude.value
})

// methods
function handleDisableManipulationAction(projectMember: ProjectMember) {
  return (
    projectMember.type === PROJECT_MEMBER_TYPE.OWNER && !isMainAccount.value
  )
}
function onPaginationRequest(props: {
  filter?: any
  pagination: {
    sortBy: string
    descending: boolean
    page: number
    rowsPerPage: number
  }
  getCellValue: (col: any, row: any) => any
}) {
  emits('request', props)
}

function onSearching(keyword: string) {
  if (!keyword) {
    clientSearchUsers.value = props.users
  }
  clientSearchUsers.value = props.users?.filter((item) => {
    return `${item.email}-${item.phoneNumber}-${item.userName}`.includes(
      keyword
    )
  })
}

// hooks
onMounted(async () => {
  await projectMemberTableRef.value?.requestServerInteraction()
})

watch(
  () => props.users,
  (newVal: ProjectMember[] | undefined) => {
    clientSearchUsers.value = newVal
  }
)
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
