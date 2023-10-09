import { HttpsResponse } from './https-response'
import { Pagging } from 'src/core/types/pagging-types'
import { Project } from 'src/core/types/project-types'
import { Notepage } from '../notepage-types'
import { Note } from '../note-types'
import { ProjectMember } from '../project-member-types'
import { UserMenu } from '../user-menu'

export interface GetLinkedNotesResponse extends HttpsResponse {
  data: {
    pageName: string
    pageID: string
  }[]
}

interface GetProjectsData extends Pagging {
  errorMsg?: string
  list: Project[]
}
interface GetProjectNotepagesData extends Pagging {
  errorMsg?: string
  list: Notepage[]
}

interface GetProjectMembersData extends Pagging {
  errorMsg?: string
  list: ProjectMember[]
}
interface GetDeletedNoteHistoryData extends Pagging {
  errorMsg?: string
  list: Note[]
}
export interface GetProjectsResponse extends HttpsResponse {
  data: GetProjectsData
}

export interface GetProjectsRequest {
  limit?: number
  page?: number
  projectName?: string
  owner?: string
}

export interface GetProjectMembersRequest {
  limit?: number
  page?: number
  projectId?: string
  userName?: string
}

export interface CreateNewProjectRequest {
  projectName: string
}
export interface CreateNewProjectResponse extends HttpsResponse {
  data: Project | string
}

export interface DeleteProjectResponse extends HttpsResponse {
  data: Project | string
}

export interface GetProjectDetailResponse extends HttpsResponse {
  data: Project
}

export interface UpdateProjectInfoResponse extends HttpsResponse {
  data: Project | string
}

export interface GetProjectNotepagesRequest {
  limit?: number
  page?: number
  projectId?: string | number
  pageName?: string
  notePageId?: string | number
  value?: string
  type?: string
}
export interface GetProjectNotepagesResponse extends HttpsResponse {
  data: GetProjectNotepagesData
}

export interface UpdateProjectNotepageResponse extends HttpsResponse {
  data: Notepage | string
}

export interface CreateProjectNotepageResponse extends HttpsResponse {
  data: Notepage | string
}

export interface GetProjectNotesResponse extends HttpsResponse {
  data: Note[]
}

export interface GetProjectMembersResponse extends HttpsResponse {
  data: GetProjectMembersData
}
export interface GetUnProjectMembersResponse extends HttpsResponse {
  data: ProjectMember[]
}
export interface RemoveProjectMemberRequest {
  projectId: string | number
  users: string[]
}

export interface RemoveProjectMemberResponse extends HttpsResponse {
  data: string
}

export interface AddProjectMemberRequest {
  projectId: string | number
  users: string[]
}

export interface AddProjectMemberResponse extends HttpsResponse {
  data: string
}

export interface GetProjectUserPermissionDetailResponse extends HttpsResponse {
  data: UserMenu[]
}

export interface UpdateProjectManagementRoleResponse extends HttpsResponse {
  data: string
}

export interface DeleteNotepageResponse extends HttpsResponse {
  data: string
}

export interface SortNotesResponse extends HttpsResponse {
  data: string
  needToReload: boolean
}

export interface GetDeletedNotesResponse extends HttpsResponse {
  data: Note[]
}

export interface RevertDeletedNotesResponse extends HttpsResponse {
  data: string
}

export interface GetDeletedNoteHistoryResponse extends HttpsResponse {
  data: GetDeletedNoteHistoryData
}

export interface CreateProjectNoteRequest {
  noteKey: string
  valueType: string
  notePageId: number
  noteValue: string
  remarks: string
}

export interface CreateProjectNoteResponse extends HttpsResponse {
  data: string
}

export interface UpdateProjectPermissionRequest {
  projectId: number
  userName: string
  authIds: number[] | string[]
}
export interface UpdateProjectPermissionResponse extends HttpsResponse {
  data: string
}
export interface UpdateProjectNoteNoteResponse extends HttpsResponse {
  data: string
}
