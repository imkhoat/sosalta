<template>
  <q-card
    flat
    class="import-progress-table full-width"
  >
    <q-card-section>
      <div
        class="member-users-header__title column justify-center items-start q-mb-md"
      >
        <strong class="title text-subtitle1 text-weight-bold"
          >Importing list</strong
        >
        <span class="subtitle text-caption text-disable"
          >Use checkbox to select object.</span
        >
      </div>
      <import-progress-filter
        v-model:model-filter="search.filter"
        v-model="search.keyword"
        @select="emits('select', $event)"
      ></import-progress-filter>
    </q-card-section>
    <q-card-section>
      <q-table
        selection="multiple"
        flat
        bordered
        muti
        class="full-width"
        :columns="columns"
        :rows="filtedItems"
        :loading="loading"
        v-model:selected="selectUsers"
      >
        <template v-slot:body-cell-file_name="props">
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
                  icon="sym_o_description"
                ></q-avatar>
              </q-avatar>
              <div class="column justify-start items-start q-ml-xs">
                <strong>{{ props.row.fileName }}</strong>
                <span class="text-caption text-disable">{{
                  props.row.fileURL
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
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onDeleteUser(props.row)"
              >
                <q-icon name="sym_o_delete"></q-icon>
              </q-btn>
              <q-btn
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
import { QTableColumn } from 'quasar'
import { computed, reactive } from 'vue'
import { ImportObject } from 'src/core/types/import-object-types'
import { useMemberSettings } from 'src/pages/member-users/hooks/use-member-settings'
import ImportProgressFilter from 'src/pages/import-progress/components/import-progress-filter.vue'
// composables
const { onDeleteUser, onViewUser, loading, selectUsers } = useMemberSettings()

// props & emits
const props = defineProps<{
  items: ImportObject[] | undefined
}>()
const emits = defineEmits(['select'])
// data
const search = reactive({
  filter: 0,
  keyword: '',
})

const columns = computed<QTableColumn[]>(() => {
  return search.filter === 0
    ? [
        {
          name: 'file_name',
          field: 'name',
          label: 'Name',
          classes: 'import-column import-column__name',
          headerClasses: 'import-column-header import-column-header__name',
          required: true,
          align: 'left',
        },
        {
          name: 'file_path',
          field: 'filePath',
          label: 'File path',
          classes: 'import-column import-column__path',
          headerClasses: 'import-column-header import-column-header__path',
          required: true,
          align: 'left',
        },
        {
          name: 'create_at',
          field: 'gmtStartTimeString',
          label: 'Date added',
          classes: 'import-column import-column__date-create',
          headerClasses:
            'import-column-header import-column-header__date-create',
          required: true,
          align: 'left',
        },
        {
          name: 'status',
          field: 'statusString',
          label: 'Import status',
          classes: 'import-column import-column__status',
          headerClasses: 'import-column-header import-column-header__status',
          required: true,
          align: 'left',
        },
      ]
    : [
        {
          name: 'file_name',
          field: 'name',
          label: 'Name',
          classes: 'import-column import-column__name',
          headerClasses: 'import-column-header import-column-header__name',
          required: true,
          align: 'left',
        },
        {
          name: 'file_path',
          field: 'filePath',
          label: 'File path',
          classes: 'import-column import-column__path',
          headerClasses: 'import-column-header import-column-header__path',
          required: true,
          align: 'left',
        },
        {
          name: 'create_at',
          field: 'gmtStartTimeString',
          label: 'Start time',
          classes: 'import-column import-column__date-create',
          headerClasses:
            'import-column-header import-column-header__date-create',
          required: true,
          align: 'left',
        },
        {
          name: 'update_at',
          field: 'gmtEndTimeString',
          label: 'End time',
          classes: 'import-column import-column__date-update',
          headerClasses:
            'import-column-header import-column-header__date-update',
          required: true,
          align: 'left',
        },
        {
          name: 'status',
          field: 'statusString',
          label: 'Import status',
          classes: 'import-column import-column__status',
          headerClasses: 'import-column-header import-column-header__status',
          required: true,
          align: 'left',
        },
      ]
})

// computed

const filtedItems = computed(() => {
  return props.items
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
.import-progress-table {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }
}
</style>
