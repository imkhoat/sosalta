<template>
  <q-card
    flat
    class="project-management-table full-width"
  >
    <q-card-section>
      <div
        class="project-management-header__title column justify-center items-start q-mb-md"
      >
        <strong class="title text-subtitle1 text-weight-bold"
          >Project list</strong
        >
        <span class="subtitle text-caption text-disable"
          >Use checkbox to select project and click view to show detail.</span
        >
      </div>
      <project-management-filter
        :items="users"
        :model-filter="activeUser"
        v-model="searchKeyword"
        @search="onSearching"
        @select="emits('select', $event)"
      ></project-management-filter>
    </q-card-section>
    <q-card-section>
      <q-table
        ref="projectTableRef"
        selection="multiple"
        flat
        bordered
        muti
        class="full-width"
        :columns="columns"
        :rows="items"
        :loading="loading"
        v-model:pagination="pagination"
        v-model:selected="selectProjects"
        @request="onPaginationRequest"
      >
        <template v-slot:body-cell-project_name="props">
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
                  :icon="MENU_ICON.PROJECT"
                ></q-avatar>
              </q-avatar>
              <div class="column justify-start items-start q-ml-xs">
                <strong>{{ props.row.projectName }}</strong>
                <span class="text-caption text-disable"
                  >Create by {{ props.row.modifiedBy }}</span
                >
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-project_owner="props">
          <q-td :props="props">
            <span>{{ props.row.owner }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-project_action="props">
          <q-td :props="props">
            <div>
              <q-btn
                v-if="hasProjectEntriesMenuVisible && props.row.isManager"
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onDeleteProject(props.row)"
              >
                <q-icon name="sym_o_delete"></q-icon>
              </q-btn>
              <q-btn
                v-if="hasProjectEntriesMenuVisible"
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onViewProjectInfo(props.row)"
              >
                <q-icon name="sym_o_info"></q-icon>
              </q-btn>
              <q-btn
                v-if="hasProjectEntriesMenuVisible"
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onViewProjectMembers(props.row)"
              >
                <q-icon name="sym_o_group"></q-icon>
              </q-btn>
              <q-btn
                v-if="hasProjectFileMenuVisible"
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onViewProjectFiles(props.row)"
              >
                <q-icon name="sym_o_folder"></q-icon>
              </q-btn>
              <q-btn
                v-if="hasProjectFileMenuVisible"
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onViewProjectNotepages(props.row)"
              >
                <q-icon name="sym_o_library_books"></q-icon>
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
import { Project } from 'src/core/types/project-types'
import { MENU_ICON } from 'src/core/types/menu-icon-types'
import { useProjects } from 'src/pages/project-management/hooks/use-projects'
import ProjectManagementFilter from 'src/pages/project-management/components/entries/project-management-filter.vue'
import { useMenusVisible } from 'src/pages/project-management/hooks/authorization/use-menus-visible'

// composables
const { hasProjectEntriesMenuVisible, hasProjectFileMenuVisible } =
  useMenusVisible()
const {
  pagination,
  searchKeyword,
  selectProjects,
  onDeleteProject,
  onViewProjectInfo,
  onViewProjectFiles,
  onViewProjectMembers,
  onViewProjectNotepages,
} = useProjects()

// props & emits
const props = defineProps<{
  items: Project[] | undefined
  loading: boolean
  users?: string[]
  activeUser: string
}>()
const emits = defineEmits(['request', 'search', 'select'])

// data
const projectTableRef = ref()

const columns: QTableColumn[] = [
  {
    name: 'project_name',
    field: 'groupName',
    label: 'Name',
    classes: 'project-column project-column__name',
    headerClasses: 'project-column-header project-column-header__name',
    required: true,
    align: 'left',
  },
  {
    name: 'project_owner',
    field: 'owner',
    label: 'Owner',
    classes: 'project-column project-column__project-owner',
    headerClasses: 'project-column-header project-column-header__project-owner',
    required: true,
    align: 'left',
  },
  {
    name: 'create_at',
    field: 'gmtCreateAtString',
    label: 'Date added',
    classes: 'project-column project-column__date-create',
    headerClasses: 'project-column-header project-column-header__date-create',
    required: true,
    align: 'left',
  },
  {
    name: 'update_at',
    field: 'gmtUpdateAtString',
    label: 'Last active',
    classes: 'project-column project-column__last-updated',
    headerClasses: 'project-column-header project-column-header__last-updated',
    required: true,
    align: 'left',
  },
  {
    name: 'note_page_count',
    field: 'notePageCount',
    label: 'Total Notepage',
    classes: 'project-column project-column__note-page-count',
    headerClasses:
      'project-column-header project-column-header__note-page-count',
    required: true,
    align: 'right',
  },
  {
    name: 'member_count',
    field: 'memberCount',
    label: 'Total Member',
    classes: 'project-column project-column__member-count',
    headerClasses: 'project-column-header project-column-header__member-count',
    required: true,
    align: 'right',
  },
  {
    name: 'project_action',
    field: 'project_action',
    label: '',
    classes: 'project-column project-column__action',
    headerClasses: 'project-column-header project-column-header__action',
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

// hooks
onMounted(() => {
  projectTableRef.value?.requestServerInteraction()
})
</script>
<style lang="scss">
.project-management-table {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }
}
</style>
