import { UserMenu } from '../user-menu'
import { HttpsResponse } from './https-response'

export interface GetUserGroupAuthResponse extends HttpsResponse {
  data: UserMenu[]
}
