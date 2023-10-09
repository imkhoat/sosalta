<template>
  <q-card
    flat
    class="project-notepages-table full-width"
  >
    <q-card-section>
      <div
        class="project-notepages-header__title column justify-center items-start q-mb-md"
      >
        <strong class="title text-subtitle1 text-weight-bold"
          >Notepages list</strong
        >
        <span class="subtitle text-caption text-disable"
          >Use checkbox to select notepage and click button to edit.</span
        >
      </div>
      <project-notepages-filter
        v-model:model-filter="search.filter"
        v-model="search.keyword"
      ></project-notepages-filter>
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
        v-model:selected="selectedNotepages"
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
                >
                  <span class="text-caption text-disable">{{
                    props.row.notePageId
                  }}</span>
                </q-avatar>
              </q-avatar>
              <div class="column justify-start items-start q-ml-xs">
                <strong>{{ props.row.pageName }}</strong>
                <span class="text-caption text-disable"
                  >Create by {{ props.row.createdBy }}</span
                >
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-user_action="props">
          <q-td :props="props">
            <div>
              <q-btn
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onDeleteNotepage(props.row)"
              >
                <q-icon name="sym_o_delete"></q-icon>
              </q-btn>
              <q-btn
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onRenameNotepage(props.row)"
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
              <q-btn
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onShowContextMenu(props.row)"
              >
                <q-icon
                  size="xs"
                  name="more_vert"
                ></q-icon>
                <q-menu
                  v-if="!isMobile"
                  class="menus-context"
                >
                  <q-list>
                    <q-item
                      clickable
                      class="row justify-start"
                      @click="onCopyNotepage(props.row)"
                    >
                      <q-item-section class="col-shrink">
                        <q-avatar
                          size="md"
                          color="grey-1"
                          text-color="primary"
                        >
                          <q-avatar
                            size="xs"
                            color="grey-3"
                            text-color="primary-4"
                            class="q-pa-xs q-box-content"
                          >
                            <q-icon
                              size="xs"
                              name="sym_o_content_copy"
                              class="material-icons-round"
                            ></q-icon>
                          </q-avatar>
                        </q-avatar>
                      </q-item-section>
                      <q-item-section
                        class="col-grow text-weight-medium q-ml-none"
                        >Copy</q-item-section
                      >
                    </q-item>
                    <q-separator></q-separator>
                    <q-item
                      clickable
                      class="row justify-start"
                      @click="onCopyNotepage(props.row)"
                    >
                      <q-item-section class="col-shrink">
                        <q-avatar
                          size="md"
                          color="grey-1"
                          text-color="primary"
                        >
                          <q-avatar
                            size="xs"
                            color="grey-3"
                            text-color="primary-4"
                            class="q-pa-xs q-box-content"
                          >
                            <q-icon
                              size="xs"
                              name="sym_o_export_notes"
                              class="material-icons-round"
                            ></q-icon>
                          </q-avatar>
                        </q-avatar>
                      </q-item-section>
                      <q-item-section
                        class="col-grow text-weight-medium q-ml-none"
                        >Export</q-item-section
                      >
                    </q-item>
                    <q-separator></q-separator>
                    <q-item
                      clickable
                      class="row justify-start"
                      @click="onViewInfoNotepage(props.row)"
                    >
                      <q-item-section class="col-shrink">
                        <q-avatar
                          size="md"
                          color="grey-1"
                          text-color="primary"
                        >
                          <q-avatar
                            size="xs"
                            color="grey-3"
                            text-color="primary-4"
                            class="q-pa-xs q-box-content"
                          >
                            <q-icon
                              size="xs"
                              name="sym_o_info"
                              class="material-icons-round"
                            ></q-icon>
                          </q-avatar>
                        </q-avatar>
                      </q-item-section>
                      <q-item-section
                        class="col-grow text-weight-medium q-ml-none"
                        >View detail</q-item-section
                      >
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
  <q-dialog
    v-if="isMobile"
    v-model="menusDialog"
    position="bottom"
    class="project-notepages-table__dialog"
  >
    <q-card class="project-notepages-table__card">
      <q-linear-progress
        :value="1"
        color="primary"
        size="sm"
      />
      <q-card-section>
        <q-list>
          <q-item
            clickable
            class="row justify-start"
            @click="onCopyNotepage(contextActiveRow)"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
              >
                <q-avatar
                  size="xs"
                  color="grey-3"
                  text-color="primary-4"
                  class="q-pa-xs q-box-content"
                >
                  <q-icon
                    size="xs"
                    name="sym_o_content_copy"
                    class="material-icons-round"
                  ></q-icon>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none"
              >Copy</q-item-section
            >
          </q-item>
          <q-separator></q-separator>
          <q-item
            clickable
            class="row justify-start"
            @click="onCopyNotepage(contextActiveRow)"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
              >
                <q-avatar
                  size="xs"
                  color="grey-3"
                  text-color="primary-4"
                  class="q-pa-xs q-box-content"
                >
                  <q-icon
                    size="xs"
                    name="sym_o_export_notes"
                    class="material-icons-round"
                  ></q-icon>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none"
              >Export</q-item-section
            >
          </q-item>
          <q-separator></q-separator>
          <q-item
            clickable
            class="row justify-start"
            @click="onViewInfoNotepage(contextActiveRow)"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
              >
                <q-avatar
                  size="xs"
                  color="grey-3"
                  text-color="primary-4"
                  class="q-pa-xs q-box-content"
                >
                  <q-icon
                    size="xs"
                    name="sym_o_info"
                    class="material-icons-round"
                  ></q-icon>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none"
              >View detail</q-item-section
            >
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { QTableColumn, useQuasar } from 'quasar'
import { computed, reactive, ref } from 'vue'
import { useProjectNotepages } from 'src/pages/project-management/hooks/use-notepages'
import ProjectNotepagesFilter from 'src/pages/project-management/components/project-notepages/project-notepages-filter.vue'
import { Notepage } from 'src/core/types/notepage-types'

// composables
const $q = useQuasar()
const {
  selectedNotepages,
  onDeleteNotepage,
  onViewNotes,
  onDrawerViewNotes,
  onRenameNotepage,
  onCopyNotepage,
  onViewInfoNotepage,
} = useProjectNotepages()

// props & emits
const props = defineProps<{
  items: Notepage[] | undefined
  loading: boolean
}>()

// data
const search = reactive({
  filter: '',
  keyword: '',
})
const menusDialog = ref(false)
const contextActiveRow = ref()
const columns: QTableColumn[] = [
  {
    name: 'user_name',
    field: 'name',
    label: 'ID| Name',
    classes: 'user-column user-column__name',
    headerClasses: 'user-column-header user-column-header__name',
    required: true,
    align: 'left',
  },
  {
    name: 'user_owner',
    field: 'owner',
    label: 'Owner',
    classes: 'user-column user-column__user-owner',
    headerClasses: 'user-column-header user-column-header__user-owner',
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
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

const filtedUsers = computed(() => {
  return props.items?.filter((user) => {
    return `${user.owner}-${user.pageName}-${user.createdBy}-${user.modifiedBy}`
      .toLowerCase()
      .includes(search.keyword.toLowerCase())
  })
})

// methods
function onShowContextMenu(notepage: Notepage) {
  menusDialog.value = !menusDialog.value
  contextActiveRow.value = notepage
}
</script>
<style lang="scss">
.project-notepages-table {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }
}
</style>
