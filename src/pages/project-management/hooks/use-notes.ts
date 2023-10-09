import {
  httpsBookmarkProjectNote,
  httpsCreateProjectNote,
  httpsDeleteNotes,
  httpsGetDeletedNoteHistory,
  httpsGetDeletedNotes,
  httpsGetNoteHistory,
  httpsGetProjectNotes,
  httpsRevertDeletedNoteHistory,
  httpsRevertDeletedNotes,
  httpsSortNotes,
  httpsUpdateProjectNote,
} from 'src/core/services/project-services'
import {
  HTTP_STATUS_CODE,
  RESPONSE_CODE,
} from 'src/core/services/utils/https-code'
import { Note } from 'src/core/types/note-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { reactive, ref } from 'vue'
import { format } from 'date-fns'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { PROJECT_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'
import { Notepage } from 'src/core/types/notepage-types'
import { CreateProjectNoteRequest } from 'src/core/types/services/project-types'
import { usePdf } from './use-pdf'
import { ATLAS_FILE_SYSTEM, AtlasFileSystem } from 'src/core/types/file-types'
import { GetSessionCredentialsRequest } from 'src/core/types/services/storage-types'
import { httpsGetSessionCredentials } from 'src/core/services/storage-services'
import { useUpload } from 'src/pages/file-system/hooks/use-upload'
import { useS3Store } from 'src/core/stores/s3-stores'
import { storeToRefs } from 'pinia'
import { useUUID } from 'src/core/composables'
import { useAWSS3 } from 'src/core/composables/use-s3'

export enum SORT_TYPE {
  CREATE_TIME = 1,
  LAST_MODIFIED_TIME = 2,
  BOOKMARKED_FIRST = 3,
  USER_ARRANGED = 4,
}
export type SortType = `${SORT_TYPE}`

export enum SORT_DIRECTION {
  ASC = 1,
  DESC = 2,
}
export type SortDirection = `${SORT_DIRECTION}`

const modal = reactive<{
  open: boolean
  type:
    | 'EDIT_NOTE_MODAL'
    | 'VIEW_NOTES'
    | 'DELETE_NOTE_MODAL'
    | 'DELETE_NOTES_MODAL'
    | 'NEW_NOTE_MODAL'
    | 'RENAME_NOTE_MODAL'
    | 'HISTORY_NOTE_MODAL'
    | 'VIEW_RECOVERY_NOTES'
    | 'EXPORT_PDF_NOTES_MODAL'
    | 'EXPORT_JSON_NOTES_MODAL'
    | 'VIEW_NOTE_MODAL'
}>({
  open: false,
  type: 'VIEW_NOTES',
})

const drawer = reactive<{
  open: boolean
  type: 'VIEW_RECOVERY_NOTES'
}>({
  open: false,
  type: 'VIEW_RECOVERY_NOTES',
})
const activeNote = ref<Note | null>(null)
const selectedNotes = ref<Note[]>([])
const activeSortType = ref<number | string | SortType>(1)
const activeSortDirection = ref<number | string | SortDirection>(1)

export function useProjectNotes() {
  // data
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { awsGetObject } = useAWSS3()
  const { setCredentials } = useS3Store()
  const { getCredentials } = storeToRefs(useS3Store())
  const {
    _generatePartData,
    _initAwsS3Client,
    _handleAwsCreateMutiplepartUpload,
    _handleAwsUploadPart,
    _handleAwsCompletedMutiplepartUpload,
    _handleSaveFileToDatabase,
    _handleAwsAbortMutiplepartUpload,
    handleClearUploadProcess,
  } = useUpload()
  //data
  const loading = ref(false)

  // function
  function onCloseModal() {
    modal.open = false
  }

  function onCreateNewNote() {
    modal.open = true
    modal.type = 'NEW_NOTE_MODAL'
  }

  function onDeleteNote(note: Note) {
    activeNote.value = note
    modal.open = true
    modal.type = 'DELETE_NOTE_MODAL'
  }

  function onDeleteNotes() {
    modal.open = true
    modal.type = 'DELETE_NOTES_MODAL'
  }

  function onEditNote(note: Note) {
    activeNote.value = note
    modal.open = true
    modal.type = 'EDIT_NOTE_MODAL'
  }

  function onViewHistoryNote(note: Note) {
    activeNote.value = note
    modal.open = true
    modal.type = 'HISTORY_NOTE_MODAL'
  }

  function onViewDetailNote(note: Note) {
    activeNote.value = note
    modal.open = true
    modal.type = 'VIEW_NOTE_MODAL'
  }

  function onExport(
    type: 'EXPORT_PDF_NOTES_MODAL' | 'EXPORT_JSON_NOTES_MODAL',
    notes: Note[]
  ) {
    selectedNotes.value = notes
    modal.open = true
    modal.type = type
  }

  function onViewNotes(note: Note) {
    activeNote.value = note
    router.push({
      name: PROJECT_MANAGEMENT_ROUTE_NAMES.NOTES,
      params: { ...route.params, noteId: activeNote.value?.noteId },
    })
  }

  function onViewRecoveryNotes() {
    modal.open = true
    modal.type = 'VIEW_RECOVERY_NOTES'
  }

  function onRenameNote(note: Note | null) {
    activeNote.value = note
    modal.open = true
    modal.type = 'RENAME_NOTE_MODAL'
  }

  async function handleGetProjectNotes(noteId: string | number) {
    try {
      loading.value = true

      const data = await httpsGetProjectNotes(noteId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        resetSelectedNotes()
        return data?.data.map((item) => {
          return {
            id: item.noteId,
            ...item,
            gmtCreateString: format(
              new Date(item.gmtCreate || ''),
              'MMM dd, yyyy'
            ).toString(),
            gmtUpdateString: format(
              new Date(item.gmtUpdate || ''),
              'MMM dd, yyyy'
            ).toString(),
            gmtCreateAtString: format(
              new Date(item.gmtCreate || ''),
              'MMM dd, yyyy hh:mm:sss'
            ).toString(),
            gmtUpdateAtString: format(
              new Date(item.gmtUpdate || ''),
              'MMM dd, yyyy hh:mm:sss'
            ).toString(),
          }
        })
      }
      return []
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return []
    } finally {
      loading.value = false
    }
  }

  async function handleCreateNewNote(
    name: string | undefined,
    projectId: string
  ) {
    try {
      if (!name) {
        $q.notify({
          message: 'Please input project name',
          type: 'negative',
        })
        return
      }

      loading.value = true

      const payload = {
        pageName: name,
        projectId,
      }

      const data = await httpsCreateProjectNote(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleDeleteActiveNote() {
    try {
      if (!activeNote.value) {
        $q.notify({
          message: 'Please select project to delete',
          type: 'negative',
        })
        return
      }
      loading.value = true

      const data = await httpsDeleteNotes([activeNote?.value?.noteId])

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Delete success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleDeleteSelectedNotes() {
    try {
      if (selectedNotes.value?.length === 0) {
        $q.notify({
          message: 'Please select project to delete',
          type: 'negative',
        })
        return
      }
      loading.value = true

      const notepageIds = selectedNotes.value.map((item) => item.noteId)

      const data = await httpsDeleteNotes(notepageIds)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Delete success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleChangeNoteName(notepage: Note) {
    try {
      if (!notepage) {
        $q.notify({
          message: 'Field required',
          type: 'negative',
        })
        return
      }

      loading.value = true

      const data = await httpsUpdateProjectNote(notepage)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Rename success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleSortNotes(
    notepageId: number,
    sortType: number,
    sortDirection: number,
    numNote: number
  ) {
    try {
      if (!notepageId) {
        $q.notify({
          message: 'Field required',
          type: 'negative',
        })
        return
      }

      loading.value = true

      const data = await httpsSortNotes(notepageId, {
        sortType,
        sortDirection,
        numNote,
      })

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Sorting success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleGetDeletedNotes(notepageId: number | string) {
    try {
      if (!notepageId) {
        $q.notify({
          message: 'Field required',
          type: 'negative',
        })
        return []
      }

      loading.value = true

      const data = await httpsGetDeletedNotes(notepageId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data
      }

      return []
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return []
    } finally {
      loading.value = false
    }
  }

  async function handleGetDeletedNoteHistory(noteId: number | string) {
    try {
      if (!noteId) {
        $q.notify({
          message: 'Field required',
          type: 'negative',
        })
        return []
      }

      loading.value = true

      const data = await httpsGetDeletedNoteHistory(noteId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data?.list.map((item) => {
          return {
            ...item,
            gmtCreateString: format(
              new Date(item.gmtCreate || ''),
              'MMM dd, yyyy'
            ).toString(),
            gmtUpdateString: format(
              new Date(item.gmtUpdate || ''),
              'MMM dd, yyyy'
            ).toString(),
          }
        })
      }

      return []
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return []
    } finally {
      loading.value = false
    }
  }
  async function handleGetNoteHistory(noteId: number | string) {
    try {
      if (!noteId) {
        $q.notify({
          message: 'Field required',
          type: 'negative',
        })
        return []
      }

      loading.value = true

      const data = await httpsGetNoteHistory(noteId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data?.list.map((item) => {
          return {
            ...item,
            gmtCreateString: format(
              new Date(item.gmtCreate || ''),
              'MMM dd, yyyy'
            ).toString(),
            gmtUpdateString: format(
              new Date(item.gmtUpdate || ''),
              'MMM dd, yyyy'
            ).toString(),
          }
        })
      }

      return []
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return []
    } finally {
      loading.value = false
    }
  }

  async function handleRevertDeletedNotes(noteIds: (number | string)[]) {
    try {
      if (!noteIds) {
        $q.notify({
          message: 'Field required',
          type: 'negative',
        })
        return []
      }

      loading.value = true

      const data = await httpsRevertDeletedNotes(noteIds)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Restore deleted notes success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return false
    } finally {
      loading.value = false
    }
  }
  async function handleBookmarkNote(noteId: string | number) {
    try {
      if (!noteId) {
        $q.notify({
          message: 'Field required',
          type: 'negative',
        })
        return []
      }

      loading.value = true

      const data = await httpsBookmarkProjectNote(noteId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Bookmark note success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function handleRevertDeletedNoteHistory(
    noteIds: (number | string)[],
    reason: string
  ) {
    try {
      if (!noteIds) {
        $q.notify({
          message: 'Field required',
          type: 'negative',
        })
        return []
      }

      loading.value = true

      const data = await httpsRevertDeletedNoteHistory(noteIds, reason)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Restore deleted note success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function handleExportNotesByPDF(notes: Note[], notePage: Notepage) {
    try {
      if (!notes) {
        $q.notify({
          message: 'Please select note to export',
          type: 'negative',
        })
        return []
      }

      loading.value = true
      const { handleExportPdf } = usePdf()

      await handleExportPdf('export-note-pdf-area', notePage.pageName)
      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return false
    } finally {
      loading.value = false
    }
  }
  function handleExportNotesByJson(notes: Note[]) {
    try {
      const dataStr = JSON.stringify(notes)
      const dataUri =
        'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

      const exportFileDefaultName = 'notes.json'

      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    } catch (error) {}
  }

  async function handleCreateProjectNote(payload: CreateProjectNoteRequest) {
    try {
      loading.value = true

      const data = await httpsCreateProjectNote(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Create success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleUpdateProjectNote(note: Note) {
    try {
      loading.value = true

      const data = await httpsUpdateProjectNote(note)
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Update success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  function resetSelectedNotes() {
    selectedNotes.value = []
  }

  function setSelectedNotes(notes: Note[]) {
    selectedNotes.value = notes
  }

  async function handleGetSessionCredentials(notePageId: string) {
    try {
      const queryParams: GetSessionCredentialsRequest = {
        prefix: notePageId,
        type: ATLAS_FILE_SYSTEM.PROJECT_FILE_SYSTEM,
      }

      const data = await httpsGetSessionCredentials(queryParams)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        setCredentials(data?.data)
      }
    } catch (error) {}
  }

  async function handleAwsGetFileDetail(key: string | undefined) {
    try {
      _initAwsS3Client()
      console.log(getCredentials.value)
      const bucketId = getCredentials.value?.bucket
      if (bucketId && key) {
        const response = await awsGetObject(bucketId, key)
        if (
          response.$metadata?.httpStatusCode === HTTP_STATUS_CODE.SUCCESS ||
          response.$metadata?.httpStatusCode ===
            HTTP_STATUS_CODE.SUCCESS_WITH_NO_CONTENT
        ) {
          return response
        }
        return null
      }
      return null
    } catch (error) {
      throw error
    }
  }

  async function handleUploadSingleFile(
    file: File | Uint8Array,
    parentId: string,
    isMemberFile: boolean
  ) {
    let bucketId, s3FileKey, uploadId

    try {
      loading.value = true
      const uploadedPartArr = []
      const partData = await _generatePartData(file)
      bucketId = getCredentials.value?.bucket
      s3FileKey = `${parentId}/${useUUID()}`

      await _initAwsS3Client()

      uploadId = await _handleAwsCreateMutiplepartUpload(
        bucketId,
        parentId,
        s3FileKey
      )

      for (let index = 0; index < partData.partQty; index++) {
        const part = partData.partArr[index]
        const eTag = await _handleAwsUploadPart(
          bucketId,
          s3FileKey,
          index + 1,
          uploadId,
          part
        )
        if (eTag) {
          uploadedPartArr.push({ ETag: eTag, PartNumber: index + 1 })
        }
      }

      await _handleAwsCompletedMutiplepartUpload(
        bucketId,
        s3FileKey,
        uploadedPartArr,
        uploadId
      )
      const saveResult = await _handleSaveFileToDatabase(
        bucketId,
        parentId,
        s3FileKey,
        file,
        partData,
        isMemberFile
      )
      if (saveResult?.code === RESPONSE_CODE.SUCCESS) {
        return saveResult?.data
      }
    } catch (error) {
      await _handleAwsAbortMutiplepartUpload(bucketId, s3FileKey, uploadId)
      throw error
    } finally {
      loading.value = false
      handleClearUploadProcess()
    }
  }

  return {
    modal,
    drawer,
    loading,
    activeNote,
    selectedNotes,
    activeSortType,
    activeSortDirection,
    onExport,
    onEditNote,
    onViewNotes,
    onCloseModal,
    onDeleteNote,
    onRenameNote,
    onDeleteNotes,
    handleSortNotes,
    onCreateNewNote,
    setSelectedNotes,
    onViewDetailNote,
    onViewHistoryNote,
    resetSelectedNotes,
    handleBookmarkNote,
    onViewRecoveryNotes,
    handleCreateNewNote,
    handleGetNoteHistory,
    handleChangeNoteName,
    handleGetDeletedNotes,
    handleGetProjectNotes,
    handleUploadSingleFile,
    handleExportNotesByPDF,
    handleDeleteActiveNote,
    handleAwsGetFileDetail,
    handleUpdateProjectNote,
    handleCreateProjectNote,
    handleExportNotesByJson,
    handleRevertDeletedNotes,
    handleDeleteSelectedNotes,
    handleGetDeletedNoteHistory,
    handleGetSessionCredentials,
    handleRevertDeletedNoteHistory,
  }
}
