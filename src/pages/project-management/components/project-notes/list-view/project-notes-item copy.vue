<template>
  <q-card
    flat
    bordered
    class="project-notes-item row justify-start items-stretch"
  >
    <q-card-section class="project-notes-item__view q-pa-none bg-positive">
      <note-view-txt :item="item"></note-view-txt>
    </q-card-section>
    <q-card-section>
      <div class="row justify-start items-center no-wrap">
        <q-avatar
          size="36px"
          color="grey-2"
          class="q-box-border"
        >
          <q-avatar
            size="28px"
            color="grey-4"
            class="q-box-border"
          >
            <span class="text-caption text-disable tex-weight-bold">
              {{ item.noteId }}
            </span>
          </q-avatar>
        </q-avatar>
        <div class="column justify-start items-start q-ml-xs">
          <strong>{{ item.noteKey }}</strong>
          <span class="text-caption text-disable -q-mt-xs"
            >Create at
            <span class="text-weight-bold">{{ item.gmtCreateString }}</span> |
            by <span class="text-weight-bold">{{ item.createdBy }}</span></span
          >
        </div>
      </div>
    </q-card-section>
    <q-card-actions class="row justify-end items-center">
      <q-btn
        flat
        size="sm"
        class="text-normal text-primary"
        @click="onDeleteNote(item)"
      >
        <q-icon name="sym_o_delete"></q-icon> Delete
      </q-btn>
      <q-btn
        flat
        size="sm"
        class="text-normal text-primary"
        @click="onRenameNote(item)"
      >
        <q-icon name="sym_o_edit"></q-icon> Rename
      </q-btn>
      <q-btn
        flat
        size="sm"
        class="text-normal text-primary"
        @click="onViewNotes(item)"
      >
        <q-icon name="sym_o_description"></q-icon> View
      </q-btn>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { Note } from 'src/core/types/note-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import NoteViewTxt from 'src/pages/project-management/components/project-notes/note-view/note-view-txt.vue'

// props & emits
const props = defineProps<{
  item: Note
  notepageId?: string | number
}>()

// composables
const { onDeleteNote, onViewNotes, onRenameNote } = useProjectNotes()
</script>
<style lang="scss">
.project-notes-item {
}
</style>
