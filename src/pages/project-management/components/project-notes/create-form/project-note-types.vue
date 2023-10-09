<template>
  <q-card flat>
    <q-card-section class="row justify-start items-start">
      <div
        v-for="(item, index) in noteTypes"
        :key="index"
        class="col-4 col-md-3 column justify-center items-center q-pa-md"
      >
        <q-avatar
          v-ripple
          size="70px"
          color="grey-1"
          :class="{
            'text-disable cursor-not-allowed': item.disable,
            'cursor-pointer': !item.disable,
          }"
          @click="onSelectNoteType(item)"
        >
          <q-avatar
            size="50px"
            color="grey-3"
          >
            <q-icon :name="item.icon"></q-icon>
          </q-avatar>
        </q-avatar>
        <span class="text-disable text-caption text-center">{{
          item.name
        }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

export interface NoteType {
  name: string
  icon: string
  value: string
  disable?: boolean
  type:
    | 'TXT'
    | 'RICH_TEXT'
    | 'TABLE'
    | 'NUMBER'
    | 'INTEGER'
    | 'TIME'
    | 'DATE'
    | 'LINK_URL'
    | 'LINK_NOTEPAGE'
    | 'LINK_FILE'
    | 'SIGNATURE'
    | 'DRAW'
}

// props & emits
const emits = defineEmits(['select'])

//data
const noteTypes = ref<NoteType[]>([
  {
    name: 'Text',
    icon: 'sym_o_drag_handle',
    type: 'TXT',
    value: '0',
  },
  {
    name: 'Rich text',
    icon: 'sym_o_edit_note',
    type: 'RICH_TEXT',
    value: '9',
  },
  {
    name: 'Table',
    icon: 'sym_o_table_view',
    type: 'TABLE',
    value: '1',
  },
  {
    name: 'Number',
    icon: 'sym_o_looks_one',
    type: 'NUMBER',
    value: '2',
  },
  {
    name: 'Integer',
    icon: 'sym_o_pin',
    type: 'INTEGER',
    value: '3',
  },
  {
    name: 'Time',
    icon: 'sym_o_schedule',
    type: 'TIME',
    value: '4',
  },
  {
    name: 'Date',
    icon: 'sym_o_calendar_month',
    type: 'DATE',
    value: '5',
  },
  {
    name: 'Link URL',
    icon: 'sym_o_link',
    type: 'LINK_URL',
    value: '6',
  },
  {
    name: 'Link Notepage',
    icon: 'sym_o_auto_stories',
    type: 'LINK_NOTEPAGE',
    value: '7',
  },
  {
    name: 'Link Files',
    icon: 'sym_o_file_present',
    type: 'LINK_FILE',
    value: '8',
  },
  {
    name: 'Signature',
    icon: 'sym_o_gesture',
    type: 'SIGNATURE',
    value: '10',
  },
  {
    name: 'Draw',
    icon: 'sym_o_draw',
    type: 'DRAW',
    value: '11',
  },
])

function onSelectNoteType(item: NoteType) {
  emits('select', item)
}
</script>
