<template>
  <q-timeline class="project-notes-recovery-single-note">
    <q-timeline-entry
      v-for="item in items"
      :key="item.noteId"
    >
      <template v-slot:title>
        <span class="text-disable text-caption"
          >Update at {{ item.gmtUpdateString }} | By
          {{ item?.modifiedBy }}</span
        >
      </template>
      <template v-slot:subtitle>
        <div class="row justify-between items-center">
          <strong
            class="text-body2 text-disable-none text-weight-bold text-primary"
            >{{ item.noteKey }}</strong
          >
          <q-btn
            v-if="!viewMode"
            size="sm"
            color="secondary"
            flat
          >
            Recovery
            <q-popup-edit
              v-model="form.edit"
              :cover="false"
              :offset="[0, 10]"
            >
              <div class="column justify-start items-end q-gutter-y-sm">
                <q-input
                  label="Reason"
                  outlined
                  v-model="form.reason"
                  dense
                  autogrow
                  autofocus
                ></q-input>
                <q-btn
                  size="sm"
                  color="primary"
                  unelevated
                  :loading="loading"
                  @click="onRecovery(item)"
                  >Save</q-btn
                >
              </div>
            </q-popup-edit>
          </q-btn>
        </div>
      </template>

      <project-notes-view-section
        :expand="true"
        :item="item"
      />
    </q-timeline-entry>
  </q-timeline>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { Note } from 'src/core/types/note-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import ProjectNotesViewSection from 'src/pages/project-management/components/project-notes/project-notes-view-section.vue'

// composable
const { loading, handleRevertDeletedNoteHistory } = useProjectNotes()
// props
const props = defineProps<{
  items: Note[]
  viewMode?: boolean
}>()
const emits = defineEmits(['close', 'refresh'])
// data
const form = reactive({
  reason: '',
  edit: false,
})
// method
async function onRecovery(item: Note) {
  if (!item?.noteHistoryId) {
    return
  }
  const payload = [item.noteHistoryId]
  await handleRevertDeletedNoteHistory(payload, form.reason)
  emits('close')
  emits('refresh')
}
</script>
<style lang="scss">
.project-notes-recovery-single-note {
  .q-timeline__subtitle {
    opacity: 1 !important;
    margin-bottom: 0 !important;
  }

  .q-timeline__title {
    line-height: 11px;
  }
}
</style>
