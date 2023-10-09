import { HttpsResponse } from './https-response'
import { OrderRecord } from 'src/core/types/order-record-type'
import { Subscription, SubscriptionPack } from 'src/core/types/subscription'
import { Pagging } from 'src/core/types/pagging-types'
interface GetMemberCenterOrderRecordData extends OrderRecord {
  errorMsg?: string
}
interface GetSubscriptionRecordsData extends Pagging {
  errorMsg?: string
  list: Subscription[]
}
interface SubscriptionSelector {
  [key: string | number]: SubscriptionPack[]
}
export interface GetMemberCenterOrderRecordResponse extends HttpsResponse {
  data: GetMemberCenterOrderRecordData
}

export interface GetSubscriptionRecordsResponse extends HttpsResponse {
  data: GetSubscriptionRecordsData
  selector: SubscriptionSelector
}
