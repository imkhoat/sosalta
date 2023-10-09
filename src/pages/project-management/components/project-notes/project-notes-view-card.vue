<template>
  <q-card class="project-notes-view-card">
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
        :readonly="true"
        lazy-rules
        hide-bottom-space
        v-bind="$attrs"
        v-model="form.noteKey"
        class="q-mb-md"
      ></q-input>
      <q-field
        label="Content"
        readonly
        dense
        outlined
        stack-label
        class="q-mb-md project-notes-view-card__content"
      >
        <project-notes-view-section
          :item="activeNote"
          class="full-width fit bg-white"
        ></project-notes-view-section>
      </q-field>
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
        :readonly="true"
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
import useRules from 'src/core/composables/use-rules'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import { NoteValueType, NOTE_VALUE_TYPE } from 'src/core/types/note-value-type'
import ProjectNotesViewSection from 'src/pages/project-management/components/project-notes/project-notes-view-section.vue'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])
const props = defineProps<{
  projectTeamId?: string | number
  notepageId: string | number
}>()
// composables
const { t } = useI18n()
const { requiredRules } = useRules()
const { activeNote } = useProjectNotes()

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
  ]
})
const editNotesTitleCard = computed(() => {
  switch (form.valueType) {
    case NOTE_VALUE_TYPE.TXT:
      return 'View Text Note'
    case NOTE_VALUE_TYPE.DATE:
      return 'View Date Note'
    case NOTE_VALUE_TYPE.DRAW:
      return 'View Draw Note'
    case NOTE_VALUE_TYPE.INTEGER:
      return 'View Integer Note'
    case NOTE_VALUE_TYPE.LINK_FILE:
      return 'View File Link Note'
    case NOTE_VALUE_TYPE.LINK_NOTEPAGE:
      return 'View Notepage Link Note'
    case NOTE_VALUE_TYPE.LINK_URL:
      return 'View Url Link Note'
    case NOTE_VALUE_TYPE.NUMBER:
      return 'View Number Note'
    case NOTE_VALUE_TYPE.RICH_TEXT:
      return 'View Rich Text Note'
    case NOTE_VALUE_TYPE.SIGNATURE:
      return 'View Signature Note'
    case NOTE_VALUE_TYPE.TABLE:
      return 'View Table Note'
    case NOTE_VALUE_TYPE.TIME:
      return 'View Time Note'
    default:
      return 'View Text Note'
  }
})
// methods
function onClose() {
  emits('close')
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
.project-notes-view-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
  .q-field__control-container {
    padding-bottom: map-get($map: $space-sm, $key: 'y');
    .q-field__label {
      z-index: 2;
    }
    .q-card {
      background-color: white !important;
      padding: 0;
    }
    .q-card__section {
      padding: map-get($map: $space-xs, $key: 'y');
      background-color: white;
    }
  }
}
</style>
