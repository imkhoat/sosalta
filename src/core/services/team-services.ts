import { https } from 'boot/axios'
import { API } from './utils/apis'
import { errorHandler } from 'src/core/utils/error-handler'
import { GetUserGroupAuthResponse } from '../types/services/team-types'

/**
 * Register new account
 * @param params
 */
async function httpsGetTeams() {
  try {
    const { data } = await https.get(`${API.PROJECT.GET_LINKED_NOTES}}`)
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetTeamUserGroupAuth(groupId: string) {
  try {
    const { data } = await https.post<GetUserGroupAuthResponse>(
      API.USER.TEAM_GET_USER_GROUP_AUTH,
      null,
      {
        params: { groupId },
      }
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

export { httpsGetTeams, httpsGetTeamUserGroupAuth }
