<template>
  <q-card
    flat
    class="team-management-table full-width"
  >
    <q-card-section>
      <div
        class="team-management-header__title column justify-center items-start q-mb-md"
      >
        <strong class="title text-subtitle1 text-weight-bold">Team list</strong>
        <span class="subtitle text-caption text-disable"
          >Use checkbox to select team and click view to show detail.</span
        >
      </div>
      <team-management-filter
        :items="users"
        :model-filter="activeUser"
        v-model="searchKeyword"
        @search="onSearching"
        @select="emits('select', $event)"
      ></team-management-filter>
    </q-card-section>
    <q-card-section>
      <q-table
        ref="teamTableRef"
        selection="multiple"
        flat
        bordered
        muti
        class="full-width"
        :columns="columns"
        :rows="teams"
        :loading="loading"
        v-model:pagination="pagination"
        v-model:selected="selectTeams"
        @request="onPaginationRequest"
      >
        <template v-slot:body-cell-team_name="props">
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
                  icon="groups_3"
                ></q-avatar>
              </q-avatar>
              <div class="column justify-start items-start q-ml-xs">
                <strong>{{ props.row.groupName }}</strong>
                <span class="text-caption text-disable"
                  >Create by {{ props.row.createrName }}</span
                >
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-team_owner="props">
          <q-td :props="props">
            <span>{{ props.row.owner }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-team_action="props">
          <q-td :props="props">
            <div>
              <q-btn
                v-if="hasTeamSettingMenuVisible && props.row.managerUser"
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onDeleteTeam(props.row)"
              >
                <q-icon name="sym_o_delete"></q-icon>
              </q-btn>
              <q-btn
                v-if="hasTeamSettingMenuVisible"
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onViewTeamInfo(props.row)"
              >
                <q-icon name="sym_o_info"></q-icon>
              </q-btn>
              <q-btn
                v-if="hasTeamSettingMenuVisible"
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onViewTeamMembers(props.row)"
              >
                <q-icon name="sym_o_group"></q-icon>
              </q-btn>
              <q-btn
                v-if="hasTeamFileMenuVisible"
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onViewTeamFiles(props.row)"
              >
                <q-icon name="sym_o_folder"></q-icon>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { QTableColumn } from 'quasar'
import { onMounted, ref } from 'vue'
import { Team } from 'src/core/types/team-types'
import { useTeams } from 'src/pages/team-management/hooks/use-teams'
import { useMenusVisible } from 'src/pages/team-management/hooks/authorization/use-menus-visible'
import TeamManagementFilter from 'src/pages/team-management/components/entries/team-management-filter.vue'

// composables
const {
  searchKeyword,
  pagination,
  selectTeams,
  onDeleteTeam,
  onViewTeamInfo,
  onViewTeamFiles,
  onViewTeamMembers,
} = useTeams()
const { hasTeamFileMenuVisible, hasTeamSettingMenuVisible } = useMenusVisible()

// props & emits
const props = defineProps<{
  teams: Team[] | undefined
  loading: boolean
  users?: string[]
  activeUser: string
}>()
const emits = defineEmits(['request', 'search', 'select'])
// data
const teamTableRef = ref()

const columns: QTableColumn[] = [
  {
    name: 'team_name',
    field: 'groupName',
    label: 'Name',
    classes: 'team-column team-column__name',
    headerClasses: 'team-column-header team-column-header__name',
    required: true,
    align: 'left',
  },
  {
    name: 'team_owner',
    field: 'owner',
    label: 'Owner',
    classes: 'team-column team-column__team-owner',
    headerClasses: 'team-column-header team-column-header__team-owner',
    required: true,
    align: 'left',
  },
  {
    name: 'create_at',
    field: 'gmtCreateAtString',
    label: 'Date added',
    classes: 'team-column team-column__date-create',
    headerClasses: 'team-column-header team-column-header__date-create',
    required: true,
    align: 'left',
  },
  {
    name: 'update_at',
    field: 'gmtUpdateAtString',
    label: 'Last active',
    classes: 'team-column team-column__last-updated',
    headerClasses: 'team-column-header team-column-header__last-updated',
    required: true,
    align: 'left',
  },
  {
    name: 'member_qty',
    field: 'userCount',
    label: 'Total members',
    classes: 'team-column team-column__member_qty',
    headerClasses: 'team-column-header team-column-header__member_qty',
    required: true,
    align: 'right',
  },
  {
    name: 'team_action',
    field: 'team_action',
    label: '',
    classes: 'team-column team-column__action',
    headerClasses: 'team-column-header team-column-header__action',
    required: true,
    align: 'right',
  },
]

// methods
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

function onSearching(props: string) {
  emits('search', props)
}
onMounted(() => {
  teamTableRef.value?.requestServerInteraction()
})
</script>
<style lang="scss">
.team-management-table {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }
}
</style>
