import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { useProjectStore } from 'src/core/stores/projects'

export function useActiveProjectActionsVisible() {
  const { getActiveProject, getUserProjectAuthorization } = storeToRefs(
    useProjectStore()
  )
  const { isMainAccount } = storeToRefs(useAuthStore())

  const _userProjectNoteAuthorization = computed(() => {
    return getUserProjectAuthorization.value.note.functions
  })
  const _userProjectNotePageAuthorization = computed(() => {
    return getUserProjectAuthorization.value.notePage.functions
  })

  const hasCreateProjectNoteAuthorization = computed(() => {
    return (
      isMainAccount.value ||
      _userProjectNoteAuthorization.value.createNote?.visible
    )
  })

  const hasDeleteProjectNoteAuthorization = computed(() => {
    return (
      isMainAccount.value ||
      _userProjectNoteAuthorization.value.deleteNote?.visible
    )
  })

  const hasEditProjectNoteAuthorization = computed(() => {
    return (
      isMainAccount.value ||
      _userProjectNoteAuthorization.value.editNote?.visible
    )
  })

  const hasListProjectNoteAuthorization = computed(() => {
    return (
      isMainAccount.value ||
      _userProjectNoteAuthorization.value.listNote?.visible
    )
  })

  const hasExportProjectNoteAuthorization = computed(() => {
    return (
      isMainAccount.value ||
      _userProjectNoteAuthorization.value.exportNote?.visible
    )
  })

  const hasCreateProjectNotePageAuthorization = computed(() => {
    return (
      isMainAccount.value ||
      _userProjectNotePageAuthorization.value.createNotePage?.visible
    )
  })

  const hasDeleteProjectNotePageAuthorization = computed(() => {
    return (
      isMainAccount.value ||
      _userProjectNotePageAuthorization.value.deleteNotePage?.visible
    )
  })

  const hasEditProjectNotePageAuthorization = computed(() => {
    return (
      isMainAccount.value ||
      _userProjectNotePageAuthorization.value.editNotePage?.visible
    )
  })

  const hasListProjectNotePageAuthorization = computed(() => {
    return (
      isMainAccount.value ||
      _userProjectNotePageAuthorization.value.listNotePage?.visible
    )
  })

  const hasCopyProjectNotePageAuthorization = computed(() => {
    return (
      isMainAccount.value ||
      _userProjectNotePageAuthorization.value.copyNotePage?.visible
    )
  })

  const hasDeleteProjectAuthorization = computed(() => {
    return isMainAccount.value || getActiveProject.value.isManager
  })

  const hasCreateProjectAuthorization = computed(() => {
    return isMainAccount.value || getActiveProject.value.isManager
  })

  const hasViewProjectInfoAuthorization = computed(() => {
    return isMainAccount.value || getActiveProject.value.isManager
  })

  const hasViewProjectMembersAuthorization = computed(() => {
    return isMainAccount.value || getActiveProject.value.isManager
  })

  const hasEditProjectNameAuthorization = computed(() => {
    return isMainAccount.value || getActiveProject.value.isManager
  })

  const hasCreateProjectRoleAuthorization = computed(() => {
    return isMainAccount.value || getActiveProject.value.isManager
  })

  const hasEditProjectRoleAuthorization = computed(() => {
    return isMainAccount.value || getActiveProject.value.isManager
  })

  const hasDeleteProjectRoleAuthorization = computed(() => {
    return isMainAccount.value || getActiveProject.value.isManager
  })

  const hasAddProjectMemberAuthorization = computed(() => {
    return isMainAccount.value || getActiveProject.value.isManager
  })

  const hasDeleteProjectMemberAuthorization = computed(() => {
    return isMainAccount.value || getActiveProject.value.isManager
  })

  const hasAssignProjectMemberAuthorization = computed(() => {
    return isMainAccount.value || getActiveProject.value.isManager
  })

  const hasEditProjectMemberPermissionsAuthorization = computed(() => {
    return isMainAccount.value || getActiveProject.value.isManager
  })

  return {
    hasCreateProjectNoteAuthorization,
    hasEditProjectNoteAuthorization,
    hasDeleteProjectNoteAuthorization,
    hasListProjectNoteAuthorization,
    hasExportProjectNoteAuthorization,
    hasCreateProjectNotePageAuthorization,
    hasEditProjectNotePageAuthorization,
    hasDeleteProjectNotePageAuthorization,
    hasListProjectNotePageAuthorization,
    hasCopyProjectNotePageAuthorization,
    hasDeleteProjectAuthorization,
    hasCreateProjectAuthorization,
    hasViewProjectInfoAuthorization,
    hasViewProjectMembersAuthorization,
    hasEditProjectNameAuthorization,
    hasCreateProjectRoleAuthorization,
    hasEditProjectRoleAuthorization,
    hasDeleteProjectRoleAuthorization,
    hasAddProjectMemberAuthorization,
    hasDeleteProjectMemberAuthorization,
    hasAssignProjectMemberAuthorization,
    hasEditProjectMemberPermissionsAuthorization,
  }
}
