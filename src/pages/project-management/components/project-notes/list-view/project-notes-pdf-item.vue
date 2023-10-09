<template>
  <q-card
    flat
    class="project-notes-pdf-item full-width"
  >
    <q-card-section class="row no-wrap justify-between items-start">
      <div class="column justify-start items-start q-ml-xs">
        <strong class="text-body2 text-weight-bold">{{ item.noteKey }}</strong>
        <span class="text-body2 text-disable">
          Create at {{ item.gmtCreateAtString }}
        </span>
      </div>
      <q-btn
        v-if="item.star"
        round
        rounded
        size="sm"
        flat
      >
        <q-icon
          size="20px"
          :name="item.star ? 'bookmark' : 'sym_r_bookmark'"
        ></q-icon>
      </q-btn>
    </q-card-section>
    <q-card-section
      class="project-notes-pdf-item__view overflow-hidden rounded-borders bg-transparent"
    >
      <project-notes-view-section
        :expand="true"
        :item="item"
      />
    </q-card-section>
    <q-card-section>
      <div
        class="column justify-start items-start no-wrap ext-caption text-disable"
      >
        <span class="q-pr-sm"> Comment: </span>
        <div class="q-pa-sm bg-grey-1 rounded-borders full-width">
          {{ item.remarks }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { Note } from 'src/core/types/note-types'
import ProjectNotesViewSection from 'src/pages/project-management/components/project-notes/project-notes-view-section.vue'

// props & emits
const props = defineProps<{
  item: Note
  notepageId?: string | number
}>()
</script>
<style lang="scss">
.project-notes-pdf-item {
  overflow: hidden;
}
</style>
