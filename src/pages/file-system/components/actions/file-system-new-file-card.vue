<template>
  <q-card
    class="file-system-new-file-card column justify-start items-stretch"
    :class="{ 'file-system-new-file-card__full-screen': fullScreen }"
  >
    <q-form
      ref="fileSystemNewFileCard"
      no-error-focus
      :autofocus="false"
      @submit="onSubmitForm"
    >
      <q-card-section class="row justify-between items-start no-wrap">
        <q-section-header
          :title="titleCard"
          :sub-title-html="subTitleCard"
        ></q-section-header>
        <q-btn
          v-if="currentStep === 'INPUT_CONTENT'"
          size="sm"
          flat
          rounded
          round
          icon="fullscreen"
          @click="onChangeScreenMode"
        >
          <q-tooltip>Full screen</q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section v-if="currentStep === 'SELECT_FILE_TYPE'">
        <file-system-select-file-type
          v-model="form.fileType"
          v-model:model-type-name="form.fileTypeName"
        ></file-system-select-file-type>
      </q-card-section>
      <q-card-section
        class="col-grow"
        v-if="currentStep === 'INPUT_CONTENT'"
      >
        <file-system-new-txt-file-form
          v-if="form.fileType === 'TXT'"
          v-model="form.fileName"
          v-model:model-string="form.fileString"
        ></file-system-new-txt-file-form>
        <file-system-new-html-file-form
          v-if="form.fileType === 'HTML'"
          v-model="form.fileName"
          v-model:model-string="form.fileString"
        ></file-system-new-html-file-form>
        <file-system-new-word-file-form
          v-if="form.fileType === 'WORD'"
          v-model="form.fileName"
          v-model:model-string="form.fileString"
        ></file-system-new-word-file-form>
        <file-system-new-markdown-file-form
          v-if="form.fileType === 'MARKDOWN'"
          v-model="form.fileName"
          v-model:model-string="form.fileString"
        ></file-system-new-markdown-file-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ActionProp } from 'src/core/types/action-prop-types'

import { errorHandler } from 'src/core/utils/error-handler'
import { useFiles } from 'src/pages/file-system/hooks/use-files'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { NewFileType } from 'src/core/types/services/storage-types'

import FileSystemSelectFileType from 'src/pages/file-system/components/actions/new-file/file-system-select-file-type.vue'
import FileSystemNewTxtFileForm from 'src/pages/file-system/components/actions/new-file/file-system-new-txt-file-form.vue'
import FileSystemNewHtmlFileForm from 'src/pages/file-system/components/actions/new-file/file-system-new-html-file-form.vue'
import FileSystemNewWordFileForm from 'src/pages/file-system/components/actions/new-file/file-system-new-word-file-form.vue'
import FileSystemNewMarkdownFileForm from 'src/pages/file-system/components/actions/new-file/file-system-new-markdown-file-form.vue'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh', 'screen-mode'])

// composables
const { t } = useI18n()
const { handleCreateNewFile, loading } = useFiles()
const { getParent } = useFileSystemStore()

// data
const fullScreen = ref(false)
const currentStep = ref<'SELECT_FILE_TYPE' | 'INPUT_CONTENT'>(
  'SELECT_FILE_TYPE'
)
const form = reactive<{
  fileName: string
  fileString: string
  fileType: NewFileType
  fileTypeName?: string
}>({
  fileType: 'TXT',
  fileString: '',
  fileName: '',
  fileTypeName: 'text',
})
// computed
const formActions = computed((): ActionProp[] => {
  return currentStep.value === 'SELECT_FILE_TYPE'
    ? [
        {
          color: 'primary',
          flat: true,
          name: t('textActions.Close'),
          action: onClose,
        },
        {
          mode: 'submit',
          color: 'primary',
          flat: true,
          name: t('textActions.Next'),
        },
      ]
    : [
        {
          color: 'primary',
          flat: true,
          name: t('textActions.Back'),
          action: onPrev,
        },
        {
          mode: 'submit',
          color: 'primary',
          flat: true,
          name: t('textActions.Save'),
          loading: loading.value,
        },
      ]
})

const subTitleCard = computed(() => {
  return `New file will be save on <strong class="text-disable-none text-primary">${getParent?.name}</strong> folder`
})

const titleCard = computed(() => {
  return `Create new ${form.fileTypeName?.toLowerCase()} file`
})
// methods
function onClose() {
  emits('close')
}

function onNext() {
  currentStep.value = 'INPUT_CONTENT'
}

function onPrev() {
  fullScreen.value = false
  currentStep.value = 'SELECT_FILE_TYPE'
  emits('screen-mode', fullScreen.value)
}

async function onCreateNewObject() {
  try {
    if (!form.fileName) {
      errorHandler.notify('Please input filename')
      return
    }
    await handleCreateNewFile(form)

    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

function onChangeScreenMode() {
  fullScreen.value = !fullScreen.value
  emits('screen-mode', fullScreen.value)
}

function onSubmitForm() {
  if (currentStep.value === 'SELECT_FILE_TYPE') {
    onNext()
    return
  }
  onCreateNewObject()
}
</script>
<style lang="scss">
.file-system-new-file-card {
  width: 350px;
  max-width: calc(100vw - 48px);
  &__full-screen {
    width: 100%;
    height: 100%;
  }
}
</style>
