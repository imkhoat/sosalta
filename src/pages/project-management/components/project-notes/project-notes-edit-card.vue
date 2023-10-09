<template>
  <q-card class="project-notes-edit-card">
    <q-card-section>
      <q-section-header
        :title="editNotesTitleCard"
        :sub-title="activeNote?.noteKey"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <q-input
        id="notepage-name"
        label="Note name"
        stack-label
        outlined
        dense
        :rules="rules.noteKey"
        lazy-rules
        hide-bottom-space
        v-bind="$attrs"
        v-model="form.noteKey"
        class="q-mb-md"
      ></q-input>
      <project-note-txt
        v-if="form.valueType === NOTE_VALUE_TYPE.TXT"
        v-model="form.noteValue"
        label="Text note content"
        placeholder
        class="q-mb-md"
      ></project-note-txt>
      <project-note-rich-text
        v-else-if="form.valueType === NOTE_VALUE_TYPE.RICH_TEXT"
        v-model="form.noteValue"
        label="Rich text note content"
        placeholder
        class="q-mb-md"
      ></project-note-rich-text>
      <project-note-number
        v-else-if="form.valueType === NOTE_VALUE_TYPE.NUMBER"
        v-model="form.noteValue"
        label="Number note content"
        placeholder
        class="q-mb-md"
      ></project-note-number>
      <project-note-number
        :integer-only="true"
        v-else-if="form.valueType === NOTE_VALUE_TYPE.INTEGER"
        v-model="form.noteValue"
        label="Integer note content"
        placeholder
        class="q-mb-md"
      ></project-note-number>
      <project-note-date
        :time-only="true"
        v-else-if="form.valueType === NOTE_VALUE_TYPE.TIME"
        v-model="form.noteValue"
        label="Time note content"
        placeholder
        class="q-mb-md"
      ></project-note-date>
      <project-note-date
        v-else-if="form.valueType === NOTE_VALUE_TYPE.DATE"
        v-model="form.noteValue"
        label="Date note content"
        placeholder
        class="q-mb-md"
      ></project-note-date>
      <project-note-link-url
        v-else-if="form.valueType === NOTE_VALUE_TYPE.LINK_URL"
        v-model="form.noteValue"
        label="Url note content"
        placeholder
        class="q-mb-md"
      ></project-note-link-url>
      <project-note-link-notepage
        v-else-if="form.valueType === NOTE_VALUE_TYPE.LINK_NOTEPAGE"
        :notepage-id="notepageId"
        v-model="form.noteValue"
        label="Notepage note content"
        placeholder
        class="q-mb-md"
      ></project-note-link-notepage>

      <project-note-signature
        v-else-if="form.valueType === NOTE_VALUE_TYPE.SIGNATURE"
        :notepage-id="notepageId"
        v-model="form.noteValue"
        label="Signature note content"
        placeholder
        class="q-mb-md"
      ></project-note-signature>

      <project-note-draw
        v-else-if="form.valueType === NOTE_VALUE_TYPE.DRAW"
        :notepage-id="notepageId"
        v-model="form.noteValue"
        label="Draw note content"
        placeholder
        class="q-mb-md"
      ></project-note-draw>
      <project-note-table
        v-else-if="form.valueType === NOTE_VALUE_TYPE.TABLE"
        :notepage-id="notepageId"
        v-model="form.noteValue"
        label="Draw note content"
        placeholder
        class="q-mb-md"
      ></project-note-table>
      <project-note-link-file
        :project-team-id="projectTeamId"
        v-else-if="form.valueType === NOTE_VALUE_TYPE.LINK_FILE"
        :notepage-id="notepageId"
        v-model="form.noteValue"
        label="File note content"
        placeholder
        class="q-mb-md"
      ></project-note-link-file>
      <q-input
        id="notepage-comment"
        label="Note comment"
        type="textarea"
        stack-label
        outlined
        dense
        :rules="rules.noteKey"
        rows="5"
        lazy-rules
        hide-bottom-space
        v-bind="$attrs"
        v-model="form.remarks"
        class="q-mb-md"
      ></q-input>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, reactive, watch } from 'vue'
import { Note } from 'src/core/types/note-types'
import useRules from 'src/core/composables/use-rules'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import ProjectNoteTxt from 'src/pages/project-management/components/project-notes/create-form/project-note-txt.vue'
import ProjectNoteRichText from 'src/pages/project-management/components/project-notes/create-form/project-note-rich-text.vue'
import ProjectNoteNumber from 'src/pages/project-management/components/project-notes/create-form/project-note-number.vue'
import ProjectNoteDate from 'src/pages/project-management/components/project-notes/create-form/project-note-date.vue'
import ProjectNoteLinkUrl from 'src/pages/project-management/components/project-notes/create-form/project-note-link-url.vue'
import ProjectNoteLinkNotepage from 'src/pages/project-management/components/project-notes/create-form/project-note-link-notepages.vue'
import ProjectNoteSignature from 'src/pages/project-management/components/project-notes/create-form/project-note-signature.vue'
import ProjectNoteDraw from 'src/pages/project-management/components/project-notes/create-form/project-note-draw.vue'
import ProjectNoteTable from 'src/pages/project-management/components/project-notes/create-form/project-note-table.vue'
import ProjectNoteLinkFile from 'src/pages/project-management/components/project-notes/create-form/project-note-link-file.vue'
import { NoteValueType, NOTE_VALUE_TYPE } from 'src/core/types/note-value-type'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])
const props = defineProps<{
  projectTeamId?: string | number
  notepageId: string | number
}>()
// composables
const { t } = useI18n()
const { requiredRules } = useRules()
const { handleUpdateProjectNote, loading, activeNote } = useProjectNotes()

// data
const form = reactive<{
  valueType: NoteValueType | undefined | number
  noteKey: string | undefined
  remarks: string | undefined
  noteValue: { value: string; pageName?: string }[]
}>({
  valueType: Number(activeNote?.value?.valueType),
  noteKey: activeNote?.value?.noteKey ?? '',
  remarks: activeNote?.value?.remarks ?? '',
  noteValue: activeNote?.value?.noteValue ?? [],
})

const rules = reactive({
  noteKey: requiredRules,
})

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Update'),
      action: onUpdateNote,
      loading: loading.value,
    },
  ]
})
const editNotesTitleCard = computed(() => {
  switch (form.valueType) {
    case NOTE_VALUE_TYPE.TXT:
      return 'Edit Text Note'
    case NOTE_VALUE_TYPE.DATE:
      return 'Edit Date Note'
    case NOTE_VALUE_TYPE.DRAW:
      return 'Edit Draw Note'
    case NOTE_VALUE_TYPE.INTEGER:
      return 'Edit Integer Note'
    case NOTE_VALUE_TYPE.LINK_FILE:
      return 'Edit File Link Note'
    case NOTE_VALUE_TYPE.LINK_NOTEPAGE:
      return 'Edit Notepage Link Note'
    case NOTE_VALUE_TYPE.LINK_URL:
      return 'Edit Url Link Note'
    case NOTE_VALUE_TYPE.NUMBER:
      return 'Edit Number Note'
    case NOTE_VALUE_TYPE.RICH_TEXT:
      return 'Edit Rich Text Note'
    case NOTE_VALUE_TYPE.SIGNATURE:
      return 'Edit Signature Note'
    case NOTE_VALUE_TYPE.TABLE:
      return 'Edit Table Note'
    case NOTE_VALUE_TYPE.TIME:
      return 'Edit Time Note'
    default:
      return 'Edit Text Note'
  }
})
// methods
function onClose() {
  emits('close')
}

async function onUpdateNote() {
  try {
    if (!form?.valueType || !form?.noteKey) {
      return
    }
    const payload: Note = {
      ...activeNote?.value,
      noteKey: form.noteKey,
      noteValue: JSON.stringify(form.noteValue),
      valueType: form.valueType as NoteValueType,
      remarks: form.remarks,
    }

    const result = await handleUpdateProjectNote(payload)
    if (result) {
      emits('refresh')
      emits('close')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

watch(
  () => activeNote.value,
  () => {
    form.noteKey = activeNote.value?.noteKey
    form.valueType = activeNote.value?.valueType
    form.remarks = activeNote.value?.remarks
    form.noteValue = JSON.parse(activeNote.value?.noteValue?.toString() ?? '[]')
  },
  {
    immediate: true,
  }
)
</script>
<style lang="scss">
.project-notes-edit-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
