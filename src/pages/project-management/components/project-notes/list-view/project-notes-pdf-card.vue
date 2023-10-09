<template>
  <q-card class="project-notes-pdf-card">
    <q-card-section>
      <q-section-header
        title="Export notes to PDF"
        sub-title="Click Export to save notes data in PDF file"
      ></q-section-header>
      <q-alert
        class="q-mt-md"
        type="warning"
        >Note: Only previously selected notes will be exported
      </q-alert>
    </q-card-section>
    <q-card-section class="q-pt-none bg-grey-1">
      <div
        class="project-notes-pdf-card__content q-mb-sm q-pa-sm rounded-borders"
      >
        <div class="project-notes-pdf-card__content-title q-pb-lg">
          <strong class="text-body1 text-weight-bold">{{
            notePage?.pageName
          }}</strong>
          <span class="text-action text-disable">{{
            notePage?.notePageId
          }}</span>
        </div>
        <div class="project-notes-pdf-card__content-notes">
          <div
            v-for="(item, index) in notes"
            :key="index + '__project-notes-pdf-card__content-notes'"
            class="project-notes-pdf-card__content-note-item bg-white q-mb-md rounded-borders"
          >
            <project-notes-pdf-item :item="item"></project-notes-pdf-item>
          </div>
        </div>
      </div>
      <div class="project-notes-pdf-card__pdf-area">
        <div id="export-note-pdf-area">
          <div
            class="project-notes-pdf-card__content-title q-pb-lg project-notes-pdf-card__pdf-area-title"
          >
            <strong class="text-body1 text-weight-bold">{{
              notePage?.pageName
            }}</strong>
            <span class="text-action text-disable">{{
              notePage?.notePageId
            }}</span>
          </div>
          <div class="project-notes-pdf-card__content-notes">
            <div
              v-for="(item, index) in notes"
              :key="index + '__project-notes-pdf-card__content-notes'"
              class="q-py-md rounded-borders project-notes-pdf-card__pdf-area-item"
            >
              <project-notes-pdf-item
                class="project-notes-pdf-card__content-note-item bg-white"
                :item="item"
              ></project-notes-pdf-item>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Note } from 'src/core/types/note-types'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import { useQuasar } from 'quasar'
import ProjectNotesPdfItem from './project-notes-pdf-item.vue'
import { Notepage } from 'src/core/types/notepage-types'
// props & emits
const emits = defineEmits(['close'])

const props = defineProps<{
  notes?: Note[] | null
  notePage?: Notepage
}>()

// composables
const { t } = useI18n()
const $q = useQuasar()
const { handleExportNotesByPDF, loading } = useProjectNotes()

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
      name: t('textActions.Export'),
      action: onExportPDF,
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

function onExportPDF() {
  if (!props.notes) {
    $q.notify({
      message: 'Please select notes to export',
      type: 'warning',
    })
    return
  }
  caculatePdfFileToBreakPage()
  handleExportNotesByPDF(props.notes, props.notePage)
  emits('close')
}

function caculatePdfFileToBreakPage() {
  const title = document.querySelector(
    '.project-notes-pdf-card__pdf-area-title'
  ) as HTMLElement
  const items = document.querySelectorAll(
    '.project-notes-pdf-card__pdf-area-item'
  )
  let totalItem = title.offsetHeight

  items.forEach((item) => {
    const elementItem = item as HTMLElement
    const elementHeight = elementItem.offsetHeight
    totalItem = totalItem + elementHeight
    if (totalItem > 800) {
      console.log(totalItem)
      if (item.parentNode) {
        var div = document.createElement('div')
        div.className = 'html2pdf__page-break'
        item.parentNode.insertBefore(div, item)
        totalItem = elementHeight
      }
    }
  })
}
</script>
<style lang="scss">
.project-notes-pdf-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);

  &__content {
    overflow: hidden;
    white-space: pre-wrap;
    max-height: 300px;
    overflow-y: auto;
  }

  &__pdf-area {
    position: fixed;
    top: 0;
    right: 0;
    z-index: -1;
    width: 100vw;
    opacity: 0;
    font-family: 'Times New Roman', Times, serif !important;
    font-size: 12px;
  }

  &__content-title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  &__content-note-item {
    border: 1px solid rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }
}
</style>
