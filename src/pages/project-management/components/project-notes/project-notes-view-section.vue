<template>
  <note-view-txt
    :expand="expand"
    :item="item"
    v-if="parseInt(item.valueType) === NOTE_VALUE_TYPE.TXT"
  ></note-view-txt>
  <note-view-rich-text
    :expand="expand"
    :item="item"
    v-else-if="parseInt(item.valueType) === NOTE_VALUE_TYPE.RICH_TEXT"
  ></note-view-rich-text>
  <note-view-number
    :expand="expand"
    :item="item"
    v-else-if="parseInt(item.valueType) === NOTE_VALUE_TYPE.NUMBER"
  ></note-view-number>
  <note-view-integer
    :expand="expand"
    :item="item"
    v-else-if="parseInt(item.valueType) === NOTE_VALUE_TYPE.INTEGER"
  ></note-view-integer>
  <note-view-time
    :expand="expand"
    :item="item"
    v-else-if="parseInt(item.valueType) === NOTE_VALUE_TYPE.TIME"
  ></note-view-time>
  <note-view-date
    :expand="expand"
    :item="item"
    v-else-if="parseInt(item.valueType) === NOTE_VALUE_TYPE.DATE"
  ></note-view-date>
  <note-view-link-url
    :expand="expand"
    :item="item"
    v-else-if="parseInt(item.valueType) === NOTE_VALUE_TYPE.LINK_URL"
  ></note-view-link-url>
  <note-view-link-notepage
    :expand="expand"
    :item="item"
    v-else-if="parseInt(item.valueType) === NOTE_VALUE_TYPE.LINK_NOTEPAGE"
  ></note-view-link-notepage>
  <note-view-link-file
    :expand="expand"
    :item="item"
    v-else-if="parseInt(item.valueType) === NOTE_VALUE_TYPE.LINK_FILE"
  ></note-view-link-file>
  <note-view-signature
    :expand="expand"
    :item="item"
    v-else-if="parseInt(item.valueType) === NOTE_VALUE_TYPE.SIGNATURE"
  ></note-view-signature>
  <note-view-draw
    :expand="expand"
    :item="item"
    v-else-if="parseInt(item.valueType) === NOTE_VALUE_TYPE.DRAW"
  ></note-view-draw>
  <note-view-table
    :expand="expand"
    :item="item"
    v-else-if="parseInt(item.valueType) === NOTE_VALUE_TYPE.TABLE"
  ></note-view-table>
</template>
<script lang="ts" setup>
import { NOTE_VALUE_TYPE } from 'src/core/types/note-value-type'
import NoteViewTxt from 'src/pages/project-management/components/project-notes/note-view/note-view-txt.vue'
import NoteViewNumber from 'src/pages/project-management/components/project-notes/note-view/note-view-number.vue'
import NoteViewInteger from 'src/pages/project-management/components/project-notes/note-view/note-view-integer.vue'
import NoteViewTime from 'src/pages/project-management/components/project-notes/note-view/note-view-time.vue'
import NoteViewDate from 'src/pages/project-management/components/project-notes/note-view/note-view-date.vue'
import NoteViewSignature from 'src/pages/project-management/components/project-notes/note-view/note-view-signature.vue'
import NoteViewDraw from 'src/pages/project-management/components/project-notes/note-view/note-view-draw.vue'
import NoteViewLinkUrl from 'src/pages/project-management/components/project-notes/note-view/note-view-link-url.vue'
import NoteViewLinkNotepage from 'src/pages/project-management/components/project-notes/note-view/note-view-link-notepage.vue'
import NoteViewLinkFile from 'src/pages/project-management/components/project-notes/note-view/note-view-link-file.vue'
import NoteViewRichText from 'src/pages/project-management/components/project-notes/note-view/note-view-rich-text.vue'
import NoteViewTable from 'src/pages/project-management/components/project-notes/note-view/note-view-table.vue'
import { Note } from 'src/core/types/note-types'

const props = defineProps<{
  item: Note
  expand: boolean
}>()
</script>
