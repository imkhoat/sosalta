<template>
  <q-card
    flat
    class="project-notes-table full-width"
  >
    <q-card-section>
      <div
        class="project-notes-header__title column justify-center items-start q-mb-md"
      >
        <strong class="title text-subtitle1 text-weight-bold"
          >Notes list</strong
        >
        <span class="subtitle text-caption text-disable"
          >Use checkbox to select notes and click button to edit.</span
        >
      </div>
      <project-notes-filter
        v-model:model-filter="search.filter"
        v-model="search.keyword"
      ></project-notes-filter>
    </q-card-section>
    <q-card-section>
      <q-table
        selection="multiple"
        flat
        bordered
        muti
        class="full-width"
        :columns="columns"
        :rows="sortedUsers"
        :loading="loading"
        v-model:selected="selectedNotes"
      >
        <template v-slot:body-cell-note_name="props">
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
                >
                  <span class="text-caption text-disable">
                    {{ props.row.noteId }}
                  </span>
                </q-avatar>
              </q-avatar>
              <div class="column justify-start items-start q-ml-xs">
                <strong>{{ props.row.noteKey }}</strong>
                <span class="text-caption text-disable"
                  >Create by {{ props.row.createdBy }}</span
                >
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-note_action="props">
          <q-td :props="props">
            <div>
              <q-btn
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onDeleteNote(props.row)"
              >
                <q-icon name="sym_o_delete"></q-icon>
              </q-btn>
              <q-btn
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onRenameNote(props.row)"
              >
                <q-icon name="sym_o_edit"></q-icon>
              </q-btn>
              <q-btn
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onViewNotes(props.row)"
              >
                <q-icon name="sym_o_description"></q-icon>
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
import { computed, reactive } from 'vue'
import {
  SORT_TYPE,
  SORT_DIRECTION,
  useProjectNotes,
} from 'src/pages/project-management/hooks/use-notes'
import ProjectNotesFilter from 'src/pages/project-management/components/project-notes/project-notes-filter.vue'
import { Note } from 'src/core/types/note-types'

// composables
const {
  selectedNotes,
  activeSortDirection,
  activeSortType,
  onDeleteNote,
  onViewNotes,
  onRenameNote,
} = useProjectNotes()

// props & emits
const props = defineProps<{
  items: Note[] | undefined
  loading: boolean
}>()

// data
const search = reactive({
  filter: '',
  keyword: '',
})

const columns: QTableColumn[] = [
  {
    name: 'note_name',
    field: 'name',
    label: 'ID | Name',
    classes: 'user-column user-column__name',
    headerClasses: 'user-column-header user-column-header__name',
    required: true,
    align: 'left',
  },
  {
    name: 'note_update_by',
    field: 'modifiedBy',
    label: 'Modify by',
    classes: 'user-column user-column__user-update-by',
    headerClasses: 'user-column-header user-column-header__user-update-by',
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
    field: 'gmtUpdateAtString',
    label: 'Last active',
    classes: 'user-column user-column__last-updated',
    headerClasses: 'user-column-header user-column-header__last-updated',
    required: true,
    align: 'left',
  },
  {
    name: 'note_action',
    field: 'note_action',
    label: 'Action',
    classes: 'user-column user-column__action',
    headerClasses: 'user-column-header user-column-header__action',
    required: true,
    align: 'right',
  },
]

// computed

const filtedUsers = computed(() => {
  return (
    props.items?.filter((user) => {
      return `${user.noteKey}-${user.notePageId}-${user.noteValue}-${user.reason}-${user.beyond}-${user.createdBy}-${user.modifiedBy}`
        .toLowerCase()
        .includes(search.keyword.toLowerCase())
    }) ?? []
  )
})

const sortedUsers = computed(() => {
  console.log('sorting....')
  const newArr = [...filtedUsers.value]
  return newArr?.sort((a, b) => {
    switch (activeSortType.value) {
      case SORT_TYPE.CREATE_TIME:
        console.log(SORT_TYPE.CREATE_TIME)
        return activeSortDirection.value === SORT_DIRECTION.ASC
          ? new Date(a.gmtCreate || '').getTime() -
              new Date(b.gmtCreate).getTime()
          : new Date(b.gmtCreate || '').getTime() -
              new Date(a.gmtCreate).getTime()
      case SORT_TYPE.LAST_MODIFIED_TIME:
        console.log(SORT_TYPE.LAST_MODIFIED_TIME)
        return activeSortDirection.value === SORT_DIRECTION.ASC
          ? new Date(a.gmtUpdate || '').getTime() -
              new Date(b.gmtUpdate).getTime()
          : new Date(b.gmtUpdate || '').getTime() -
              new Date(a.gmtUpdate).getTime()
      case SORT_TYPE.BOOKMARKED_FIRST:
        console.log(SORT_TYPE.BOOKMARKED_FIRST)
        return activeSortDirection.value === SORT_DIRECTION.ASC
          ? a.remarks.localeCompare(b.remarks)
          : b.remarks.localeCompare(a.remarks)
      case SORT_TYPE.USER_ARRANGED:
        console.log(SORT_TYPE.USER_ARRANGED)
        return activeSortDirection.value === SORT_DIRECTION.ASC
          ? a.sortNo - b.sortNo
          : b.sortNo - a.sortNo
      default:
        return 0
    }
  })
})
</script>
<style lang="scss">
.project-notes-table {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }
}
</style>
