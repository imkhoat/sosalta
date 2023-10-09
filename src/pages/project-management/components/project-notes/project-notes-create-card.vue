<template>
  <q-card class="note-management-delete-card">
    <q-card-section>
      <q-section-header
        :title="createNotesTitleCard"
        sub-title="Select note type and click create"
      ></q-section-header>
    </q-card-section>
    <q-card-section v-if="wasSelectedType">
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
        v-if="form.valueType?.type === 'TXT'"
        v-model="form.noteValue"
        label="Text note content"
        placeholder
        class="q-mb-md"
      ></project-note-txt>
      <project-note-rich-text
        v-else-if="form.valueType?.type === 'RICH_TEXT'"
        v-model="form.noteValue"
        label="Rich text note content"
        placeholder
        class="q-mb-md"
      ></project-note-rich-text>
      <project-note-number
        v-else-if="form.valueType?.type === 'NUMBER'"
        v-model="form.noteValue"
        label="Number note content"
        placeholder
        class="q-mb-md"
      ></project-note-number>
      <project-note-number
        :integer-only="true"
        v-else-if="form.valueType?.type === 'INTEGER'"
        v-model="form.noteValue"
        label="Integer note content"
        placeholder
        class="q-mb-md"
      ></project-note-number>
      <project-note-date
        :time-only="true"
        v-else-if="form.valueType?.type === 'TIME'"
        v-model="form.noteValue"
        label="Time note content"
        placeholder
        class="q-mb-md"
      ></project-note-date>
      <project-note-date
        v-else-if="form.valueType?.type === 'DATE'"
        v-model="form.noteValue"
        label="Date note content"
        placeholder
        class="q-mb-md"
      ></project-note-date>
      <project-note-link-url
        v-else-if="form.valueType?.type === 'LINK_URL'"
        v-model="form.noteValue"
        label="Url note content"
        placeholder
        class="q-mb-md"
      ></project-note-link-url>
      <project-note-link-notepage
        v-else-if="form.valueType?.type === 'LINK_NOTEPAGE'"
        :notepage-id="notepageId"
        v-model="form.noteValue"
        label="Notepage note content"
        placeholder
        class="q-mb-md"
      ></project-note-link-notepage>

      <project-note-signature
        v-else-if="form.valueType?.type === 'SIGNATURE'"
        :notepage-id="notepageId"
        v-model="form.noteValue"
        label="Signature note content"
        placeholder
        class="q-mb-md"
      ></project-note-signature>

      <project-note-draw
        v-else-if="form.valueType?.type === 'DRAW'"
        :notepage-id="notepageId"
        v-model="form.noteValue"
        label="Draw note content"
        placeholder
        class="q-mb-md"
      ></project-note-draw>
      <project-note-table
        v-else-if="form.valueType?.type === 'TABLE'"
        :notepage-id="notepageId"
        v-model="form.noteValue"
        label="Draw note content"
        placeholder
        class="q-mb-md"
      ></project-note-table>
      <project-note-link-file
        :project-team-id="projectTeamId"
        v-else-if="form.valueType?.type === 'LINK_FILE'"
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
    <q-card-section v-else>
      <project-note-types @select="onSelectNoteType"></project-note-types>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
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

import ProjectNoteTypes, {
  NoteType,
} from 'src/pages/project-management/components/project-notes/create-form/project-note-types.vue'
import { CreateProjectNoteRequest } from 'src/core/types/services/project-types'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

const props = defineProps<{
  projectTeamId?: string
  notepageId: string | number
  note?: Note | null
}>()

// composables
const { t } = useI18n()
const { requiredRules } = useRules()
const { handleCreateProjectNote, handleUploadSingleFile, loading } =
  useProjectNotes()

// data
const form = reactive<{
  valueType: NoteType | null
  noteKey: string
  remarks: string
  noteValue: { value: string; pageName?: string }[]
}>({
  valueType: null,
  noteKey: '',
  remarks: '',
  noteValue: [],
})

const rules = reactive({
  noteKey: requiredRules,
})

// computed
const wasSelectedType = computed(() => {
  return form.valueType
})
const formActions = computed((): ActionProp[] => {
  return wasSelectedType.value
    ? [
        {
          type: 'primary',
          color: 'primary',
          flat: true,
          name: t('textActions.Back'),
          action: onDeSelectNoteType,
        },
        {
          color: 'primary',
          unelevated: true,
          name: t('textActions.Create'),
          action: onCreateNewNote,
          loading: loading.value,
        },
      ]
    : [
        {
          type: 'primary',
          color: 'primary',
          flat: true,
          name: t('textActions.Close'),
          action: onClose,
        },
      ]
})
const createNotesTitleCard = computed(() => {
  switch (form.valueType?.type) {
    case 'TXT':
      return 'Create Text Note'
    case 'DATE':
      return 'Create Date Note'
    case 'DRAW':
      return 'Create Draw Note'
    case 'INTEGER':
      return 'Create Integer Note'
    case 'LINK_FILE':
      return 'Create File Link Note'
    case 'LINK_NOTEPAGE':
      return 'Create Notepage Link Note'
    case 'LINK_URL':
      return 'Create Url Link Note'
    case 'NUMBER':
      return 'Create Number Note'
    case 'RICH_TEXT':
      return 'Create Rich Text Note'
    case 'SIGNATURE':
      return 'Create Signature Note'
    case 'TABLE':
      return 'Create Table Note'
    case 'TIME':
      return 'Create Time Note'
    default:
      return 'Create Text Note'
  }
})
// methods
function onClose() {
  emits('close')
}

function onDeSelectNoteType() {
  form.valueType = null
}

async function onCreateNewNote() {
  try {
    if (!props.notepageId) {
      return
    }
    const payload: CreateProjectNoteRequest = {
      ...form,
      noteValue: JSON.stringify(form.noteValue),
      valueType: form.valueType?.value ?? '',
      notePageId:
        typeof props.notepageId === 'number'
          ? props.notepageId
          : parseInt(props.notepageId),
    }
    let result = null

    if (
      form.valueType?.type === 'SIGNATURE' ||
      form.valueType?.type === 'DRAW'
    ) {
      const response = await onUploadImageNote()
      if (response?.s3FileKey) {
        payload.noteValue = JSON.stringify([{ value: response?.s3FileKey }])
      }
      result = await handleCreateProjectNote(payload)
    } else {
      result = await handleCreateProjectNote(payload)
    }
    if (result) {
      emits('refresh')
      emits('close')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

function onSelectNoteType(item: NoteType) {
  form.valueType = item
}

async function onUploadImageNote() {
  if (!props.projectTeamId || !form.noteValue || form?.noteValue?.length <= 0) {
    return
  }
  console.log(form.noteValue[0]?.value)
  const file = await dataUrlToFile(
    form.noteValue[0]?.value,
    `${props.projectTeamId}.png`
  )
  const uploadResult = await handleUploadSingleFile(
    file,
    props.projectTeamId,
    false
  )
  return uploadResult
}
async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res: Response = await fetch(dataUrl)
  const blob: Blob = await res.blob()
  return new File([blob], fileName, { type: 'image/png' })
}
</script>
<style lang="scss">
.note-management-delete-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
