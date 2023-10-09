<template>
  <q-card class="file-system-import-card">
    <q-card-section>
      <q-section-header
        title="Import file"
        sub-title="This Import File via URL function supports HTTP, HTTPS, or FTP protocols."
      ></q-section-header>
      <q-alert
        type="info"
        class="text-caption"
      >
        Tip: if you can wget your source file, then it should work here.
      </q-alert>
    </q-card-section>
    <q-card-section v-show="currentStep === 'ADD_FILE'">
      <q-card flat>
        <q-form
          ref="refFileImport"
          class="q-gutter-md"
          @submit="onAddFile"
        >
          <q-card-section class="column justify-start q-gutter-y-md bg-grey-1">
            <q-input
              id="file-url"
              label="File URL"
              stack-label
              outlined
              dense
              v-bind="$attrs"
              lazy-rules
              hide-bottom-space
              :rules="rules.fileURL"
              v-model="form.fileURL"
            ></q-input>
            <div class="row justify-start items-start q-gutter-x-sm no-wrap">
              <q-input
                id="file-name"
                class="col-grow col-shrink"
                label="File name(optional)"
                stack-label
                outlined
                dense
                v-bind="$attrs"
                v-model="form.fileName"
              ></q-input>
              <q-folder-input
                v-model="form.filePath"
                v-model:model-object="form.filePathObject"
                id="file-path"
                class="col-grow col-shrink"
                label="File path(optional)"
                stack-label
                outlined
                dense
                :folder-id="folderTreeProps.folderId"
                :user-name="folderTreeProps.userName"
              ></q-folder-input>
              <q-btn
                flat
                color="primary"
                class="bg-grey-3 q-py-sm"
                type="submit"
                >Add</q-btn
              >
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </q-card-section>
    <q-card-section v-show="currentStep === 'ADD_FILE' && isAddedFile">
      <q-list
        bordered
        separator
        class="rounded-borders"
      >
        <q-item
          v-for="(file, index) in addedFiles"
          :key="index + '__file-system-import-card'"
          clickable
          v-ripple
          @click="onSetForm(file)"
        >
          <q-item-section>
            <q-item-label>
              <q-tooltip>{{ file.fileURL }}</q-tooltip>
              {{ file.fileName }} <q-icon name="link"></q-icon>
            </q-item-label>
            <q-item-label caption>{{ file.filePathObject?.name }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-btn
              flat
              rounded
              round
              icon="delete"
              size="sm"
              @click="onRemoveFile(file)"
            ></q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section v-show="currentStep === 'SET_PRIVATE'">
      <q-form ref="refSetPrivateForm">
        <q-option-group
          inline
          :options="publicOptions"
          type="radio"
          v-model="form.isPublic"
        />
        <q-card
          flat
          v-if="!form.isPublic"
        >
          <q-card-section class="bg-grey-1">
            <div
              class="row justify-start items-start q-gutter-x-sm no-wrap rounded-borders"
            >
              <q-input
                id="user-name"
                class="col-grow col-shrink"
                label="User name"
                stack-label
                outlined
                dense
                lazy-rules
                hide-bottom-space
                :rules="rules.ftpUserName"
                v-bind="$attrs"
                v-model="form.ftpUserName"
              ></q-input>
              <q-input
                id="password"
                class="col-grow col-shrink"
                label="Password"
                stack-label
                outlined
                dense
                lazy-rules
                hide-bottom-space
                :rules="rules.ftpPassWord"
                v-bind="$attrs"
                v-model="form.ftpPassWord"
              ></q-input>
            </div>
          </q-card-section>
        </q-card>
      </q-form>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref, toRaw } from 'vue'
import useRules from 'src/core/composables/use-rules'
import { ActionProp } from 'src/core/types/action-prop-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { FolderNode } from 'src/core/types/folder-node-types'
import { useFiles } from 'src/pages/file-system/hooks/use-files'
import { ImportFilesRequest } from 'src/core/types/services/storage-types'
import QFolderInput from 'src/core/components/molecules/quasar-extends/q-folder-input.vue'
import { useFileSystemStore } from 'src/core/stores/file-system'

interface ImportFile {
  fileURL: string
  fileName: string
  filePath: string
  filePathObject: FolderNode
}
// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

// composables
const $q = useQuasar()
const { t } = useI18n()
const { getActiveUserName } = storeToRefs(useFileSystemStore())
const { handleImportFiles } = useFiles()
const { requiredRules } = useRules()

// data
const refFileImport = ref<
  | (HTMLElement & {
      resetValidation: () => boolean
      validate: () => Promise<boolean>
    })
  | null
>(null)
const refSetPrivateForm = ref<
  (HTMLElement & { validate: () => Promise<boolean> }) | null
>(null)
const currentStep = ref<'ADD_FILE' | 'SET_PRIVATE'>('ADD_FILE')
const form = reactive({
  fileURL: '',
  fileName: getActiveUserName.value,
  filePathObject: {
    id: getActiveUserName.value || '',
    name: getActiveUserName.value || '',
    isParent: true,
    type: 'folder',
    s3FileKey: getActiveUserName.value || '',
    size: '0',
    parentId: getActiveUserName.value || '',
    bucketName: getActiveUserName.value || '',
    lazy: true,
    icon: 'sym_o_folder',
    filePathItems: [
      {
        id: getActiveUserName.value || '',
        name: getActiveUserName.value || '',
      },
    ],
    children: [],
    parent: true,
  } as FolderNode,
  filePath: getActiveUserName.value || '',
  isPublic: true,
  ftpPassWord: '',
  ftpUserName: '',
})
const files = reactive(new Map<string, ImportFile>())
const folderTreeProps = {
  folderId: getActiveUserName.value || '',
  userName: getActiveUserName.value || '',
}

const rules = reactive({
  fileURL: requiredRules,
  ftpPassWord: requiredRules,
  ftpUserName: requiredRules,
})

const publicOptions = [
  { label: 'Public', value: true },
  { label: 'Private', value: false },
]
// computed
const addedFiles = computed(() => {
  return Array.from(files.values())
})
const formActions = computed((): ActionProp[] => {
  return currentStep.value === 'ADD_FILE'
    ? [
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
          name: t('textActions.Next'),
          action: onNext,
        },
      ]
    : [
        {
          type: 'primary',
          color: 'primary',
          flat: true,
          name: t('textActions.Back'),
          action: onPrev,
        },
        {
          color: 'primary',
          flat: true,
          name: t('textActions.Import'),
          action: onImportFiles,
        },
      ]
})
const isAddedFile = computed(() => {
  return addedFiles.value?.length > 0
})

// methods
function onClose() {
  emits('close')
}

function onNext() {
  if (!_checkAddedFile()) {
    return
  }
  currentStep.value = 'SET_PRIVATE'
}

function onPrev() {
  currentStep.value = 'ADD_FILE'
}

function onAddFile() {
  const file = structuredClone(toRaw(form)) as ImportFile
  files.set(form.fileURL, file)
  _resetForm()
  _resetValidateForm()
}

function onRemoveFile(file: ImportFile) {
  files.delete(file.fileURL)
}

function onSetForm(file: ImportFile) {
  form.fileName = file.fileName
  form.filePath = file.filePath
  form.fileURL = file.fileURL
}
function _resetForm() {
  form.fileName = getActiveUserName.value
  form.filePath = getActiveUserName.value || ''
  form.fileURL = ''
}

async function onImportFiles() {
  try {
    let valid = await _validateSetPrivateForm()
    if (!_checkAddedFile() || !valid) {
      return
    }
    const params: ImportFilesRequest = {
      fileImportVOList: addedFiles.value.map((item) => {
        return {
          fileURL: item.fileURL,
          fileName: item.fileName,
          filePath: item.filePath,
        }
      }),
      isPublic: form.isPublic,
      ftpPassWord: form.ftpPassWord,
      ftpUserName: form.ftpUserName,
    }

    await handleImportFiles(params)
    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

function _checkAddedFile() {
  if (!isAddedFile.value) {
    $q.notify({
      message: 'Please import at least 1 file',
      type: 'negative',
    })
    return false
  }
  return true
}

async function _validateSetPrivateForm() {
  const result = await refSetPrivateForm.value?.validate()
  return result
}
function _resetValidateForm() {
  refFileImport.value?.resetValidation()
}
</script>
<style lang="scss">
.file-system-import-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
