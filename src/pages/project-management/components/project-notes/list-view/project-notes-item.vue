<template>
  <q-card
    flat
    class="project-notes-item full-width"
  >
    <q-card-section class="q-pa-none q-pb-sm">
      <div class="row justify-start items-center no-wrap">
        <q-avatar
          size="48px"
          color="grey-2"
          class="q-box-border"
        >
          <q-avatar
            size="34px"
            color="grey-4"
            class="q-box-border"
          >
            <span class="text-caption text-disable tex-weight-bold">
              {{ item.noteId }}
            </span>
          </q-avatar>
        </q-avatar>
        <div class="column justify-start items-start q-ml-xs">
          <strong class="text-body1 text-weight-bold">{{
            item.noteKey
          }}</strong>
          <span class="text-caption text-disable -q-mt-xs">
            Create at {{ item.gmtCreateAtString }} | by {{ item.createdBy }}
          </span>
        </div>
      </div>
      <div class="absolute-top-right">
        <q-btn
          :loading="loading"
          round
          rounded
          size="sm"
          flat
          @click="onBookmarkNote(item.noteId)"
        >
          <q-icon
            size="20px"
            :name="item.star ? 'bookmark' : 'sym_r_bookmark'"
          ></q-icon>
        </q-btn>
        <project-notes-item-actions :note="item"></project-notes-item-actions>
        <q-btn
          round
          rounded
          color="primary"
          flat
          size="sm"
          :icon="'sym_o_unfold_less'"
        ></q-btn>
        <slot />
      </div>
    </q-card-section>
    <q-card-section class="project-notes-item__view q-pa-none rounded-borders">
      <project-notes-view-section
        :expand="true"
        :item="item"
      />
    </q-card-section>
    <q-card-section class="q-px-none">
      <div
        class="column justify-start items-start no-wrap text-caption text-disable"
      >
        <span class="q-pr-sm"> Comment: </span>
        <div class="q-pa-md bg-grey-1 rounded-borders full-width">
          {{ item.remarks }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { Note } from 'src/core/types/note-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import ProjectNotesItemActions from './project-notes-item-actions.vue'
import ProjectNotesViewSection from 'src/pages/project-management/components/project-notes/project-notes-view-section.vue'
// props & emits
const props = defineProps<{
  item: Note
  notepageId?: string | number
}>()
const emits = defineEmits(['refresh'])
// composables
const { handleBookmarkNote, loading } = useProjectNotes()

async function onBookmarkNote(noteId: string | number) {
  await handleBookmarkNote(noteId)
  emits('refresh')
}
</script>
