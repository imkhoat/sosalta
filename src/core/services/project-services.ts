import { https } from 'boot/axios'
import { API } from './utils/apis'
import { errorHandler } from 'src/core/utils/error-handler'
import {
  AddProjectMemberRequest,
  AddProjectMemberResponse,
  CreateNewProjectRequest,
  CreateNewProjectResponse,
  CreateProjectNotepageResponse,
  DeleteNotepageResponse,
  DeleteProjectResponse,
  GetLinkedNotesResponse,
  GetProjectDetailResponse,
  GetProjectMembersResponse,
  GetProjectNotepagesResponse,
  GetProjectNotesResponse,
  GetProjectUserPermissionDetailResponse,
  GetProjectsResponse,
  GetUnProjectMembersResponse,
  RemoveProjectMemberRequest,
  RemoveProjectMemberResponse,
  SortNotesResponse,
  UpdateProjectInfoResponse,
  UpdateProjectManagementRoleResponse,
  UpdateProjectNotepageResponse,
  GetDeletedNotesResponse,
  RevertDeletedNotesResponse,
  GetDeletedNoteHistoryResponse,
  CreateProjectNoteRequest,
  CreateProjectNoteResponse,
  GetProjectsRequest,
  GetProjectMembersRequest,
  GetProjectNotepagesRequest,
  UpdateProjectPermissionRequest,
  UpdateProjectPermissionResponse,
  UpdateProjectNoteNoteResponse,
} from '../types/services/project-types'
import { Project } from '../types/project-types'
import { Notepage } from '../types/notepage-types'
import { Note } from '../types/note-types'

/**
 * Register new account
 * @param params
 */
async function httpsGetLinkedNotes(fileId: string) {
  try {
    const { data } = await https.get<GetLinkedNotesResponse>(
      `${API.PROJECT.GET_LINKED_NOTES}/${fileId}`
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}
/**
 * Get project list
 */
async function httpsGetProjects(payload: GetProjectsRequest) {
  try {
    const { data } = await https.get<GetProjectsResponse>(
      API.PROJECT.GET_PROJECTS,
      {
        params: payload,
      }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCreateNewProject(payload: CreateNewProjectRequest) {
  try {
    const { data } = await https.post<CreateNewProjectResponse>(
      API.PROJECT.CREATE_NEW_PROJECT,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsDeleteProject(projectId: string | number) {
  try {
    const { data } = await https.get<DeleteProjectResponse>(
      `${API.PROJECT.DELETE_PROJECT}/${projectId}`
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetProjectDetail(projectId: string | number) {
  try {
    const { data } = await https.get<GetProjectDetailResponse>(
      `${API.PROJECT.GET_PROJECT_DETAIL}/${projectId}`
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUpdateProjectInfo(payload: Project) {
  try {
    const { data } = await https.post<UpdateProjectInfoResponse>(
      API.PROJECT.UPDATE_PROJECT_INFO,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetProjectNotepages(payload: GetProjectNotepagesRequest) {
  try {
    const { data } = await https.get<GetProjectNotepagesResponse>(
      API.PROJECT.GET_PROJECT_NOTEPAGES,
      {
        params: payload,
      }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUpdateProjectNotepage(payload: Notepage) {
  try {
    const { data } = await https.post<UpdateProjectNotepageResponse>(
      API.PROJECT.UPDATE_PROJECT_NOTEPAGE,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCreateProjectNotepage(payload: {
  pageName: string
  projectId: string | number
}) {
  try {
    const { data } = await https.post<CreateProjectNotepageResponse>(
      API.PROJECT.CREATE_PROJECT_NOTEPAGE,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetProjectNotes(notePageId: string | number) {
  try {
    const { data } = await https.get<GetProjectNotesResponse>(
      API.PROJECT.GET_PROJECT_NOTES,
      {
        params: {
          notePageId,
        },
      }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetProjectMembers(payload: GetProjectMembersRequest) {
  try {
    const { data } = await https.get<GetProjectMembersResponse>(
      API.PROJECT.GET_PROJECT_MEMBERS,
      {
        params: payload,
      }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetUnProjectMembers(projectId: string | number) {
  try {
    const { data } = await https.get<GetUnProjectMembersResponse>(
      API.PROJECT.GET_UN_PROJECT_MEMBERS,
      {
        params: {
          projectId,
        },
      }
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsRemoveProjectMember(payload: RemoveProjectMemberRequest) {
  try {
    const { data } = await https.post<RemoveProjectMemberResponse>(
      API.PROJECT.REMOVE_PROJECT_MEMBER,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsAddProjectMember(payload: AddProjectMemberRequest) {
  try {
    const { data } = await https.post<AddProjectMemberResponse>(
      API.PROJECT.ADD_PROJECT_MEMBER,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}
async function httpsGetProjectUserPermissionDetail(
  projectId: string,
  userName: string
) {
  try {
    const payload = {
      projectId,
      userName,
    }
    const { data } = await https.get<GetProjectUserPermissionDetailResponse>(
      API.PROJECT.GET_PROJECT_MEMBER_PERMISSION_DETAIL,
      {
        params: payload,
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsSetProjectManagementRole(projectId: string, name: string) {
  try {
    const payload = {
      projectId,
      name,
    }
    const { data } = await https.get<UpdateProjectManagementRoleResponse>(
      API.PROJECT.SET_PROJECT_MEMBER_MANAGEMENT_ROLE,
      {
        params: payload,
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCancelProjectManagementRole(
  projectId: string,
  name: string
) {
  try {
    const payload = {
      projectId,
      name,
    }
    const { data } = await https.get<UpdateProjectManagementRoleResponse>(
      API.PROJECT.CANCEL_PROJECT_MEMBER_MANAGEMENT_ROLE,
      {
        params: payload,
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsDeleteNotepage(ids: (number | string)[]) {
  try {
    const payload = {
      ids,
    }
    const { data } = await https.post<DeleteNotepageResponse>(
      API.PROJECT.DELETE_PROJECT_NOTEPAGES,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCopyNotepage(id: number | string) {
  try {
    const { data } = await https.get<DeleteNotepageResponse>(
      `${API.PROJECT.COPY_PROJECT_NOTEPAGE}/${id}`
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsCreateProjectNote(payload: CreateProjectNoteRequest) {
  try {
    const { data } = await https.post<CreateProjectNoteResponse>(
      API.PROJECT.CREATE_PROJECT_NOTE,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsDeleteNotes(noteIds: (number | string)[]) {
  try {
    const payload = {
      noteIds,
    }
    const { data } = await https.post<DeleteNotepageResponse>(
      API.PROJECT.DELETE_PROJECT_NOTES,
      payload
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsSortNotes(
  id: number | string,
  sortOption: {
    sortType: number
    sortDirection: number
    numNote: number
  }
) {
  try {
    const { data } = await https.post<SortNotesResponse>(
      `${API.PROJECT.SORT_PROJECT_NOTES}/${id}`,
      { ...sortOption, lastGmtUpdate: new Date().toISOString() }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetDeletedNotes(notePageId: number | string) {
  try {
    const { data } = await https.get<GetDeletedNotesResponse>(
      API.PROJECT.GET_DELETED_PROJECT_NOTES,
      {
        params: {
          notePageId,
        },
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetDeletedNoteHistory(noteId: number | string) {
  try {
    const { data } = await https.get<GetDeletedNoteHistoryResponse>(
      API.PROJECT.GET_DELETED_PROJECT_NOTE_HISTORY,
      {
        params: {
          noteId,
        },
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetNoteHistory(noteId: number | string) {
  try {
    const { data } = await https.get<GetDeletedNoteHistoryResponse>(
      API.PROJECT.GET_DELETED_PROJECT_NOTE_HISTORY,
      {
        params: {
          noteId,
        },
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsRevertDeletedNotes(noteIds: (number | string)[]) {
  try {
    const { data } = await https.post<RevertDeletedNotesResponse>(
      API.PROJECT.REVERT_DELETED_PROJECT_NOTES,
      {
        noteIds,
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsRevertDeletedNoteHistory(
  noteHistoryId: (number | string)[],
  reason: string
) {
  try {
    const { data } = await https.post<RevertDeletedNotesResponse>(
      API.PROJECT.REVERT_DELETED_PROJECT_NOTE_HISTORY,
      {
        noteHistoryId,
        reason,
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetOtherProjectNotepages(projectId: string | number) {
  try {
    const { data } = await https.get<GetProjectNotepagesResponse>(
      `${API.PROJECT.GET_OTHER_NOTEPAGES}/${projectId}`
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUpdateProjectProperties(payload: Project) {
  try {
    const { data } = await https.post<UpdateProjectInfoResponse>(
      API.PROJECT.UPDATE_PROJECT_PROPERTIES,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsBookmarkProjectNote(noteId: string | number) {
  try {
    const { data } = await https.get<UpdateProjectInfoResponse>(
      `${API.PROJECT.BOOKMARK_PROJECT_NOTE}/${noteId}`
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUpdateProjectPermission(
  payload: UpdateProjectPermissionRequest
) {
  try {
    const { data } = await https.post<UpdateProjectPermissionResponse>(
      API.PROJECT.UPDATE_PROJECT_PERMISSION,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsUpdateProjectNote(payload: Note) {
  try {
    const { data } = await https.post<UpdateProjectNoteNoteResponse>(
      API.PROJECT.UPDATE_PROJECT_NOTE,
      payload
    )

    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

export {
  httpsSortNotes,
  httpsGetProjects,
  httpsDeleteNotes,
  httpsCopyNotepage,
  httpsDeleteProject,
  httpsGetNoteHistory,
  httpsDeleteNotepage,
  httpsGetLinkedNotes,
  httpsGetDeletedNotes,
  httpsGetProjectNotes,
  httpsAddProjectMember,
  httpsCreateNewProject,
  httpsGetProjectDetail,
  httpsGetProjectMembers,
  httpsUpdateProjectInfo,
  httpsCreateProjectNote,
  httpsUpdateProjectNote,
  httpsRevertDeletedNotes,
  httpsBookmarkProjectNote,
  httpsGetUnProjectMembers,
  httpsRemoveProjectMember,
  httpsGetProjectNotepages,
  httpsUpdateProjectNotepage,
  httpsCreateProjectNotepage,
  httpsGetDeletedNoteHistory,
  httpsUpdateProjectProperties,
  httpsUpdateProjectPermission,
  httpsGetOtherProjectNotepages,
  httpsSetProjectManagementRole,
  httpsRevertDeletedNoteHistory,
  httpsCancelProjectManagementRole,
  httpsGetProjectUserPermissionDetail,
}
