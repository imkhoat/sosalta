import { https } from 'boot/axios'
import { API } from './utils/apis'
import { errorHandler } from 'src/core/utils/error-handler'
import {
  GetMemberCenterOrderRecordResponse,
  GetSubscriptionRecordsResponse,
} from '../types/services/member-center-types'
import { RESPONSE_CODE } from './utils/https-code'
import { useMemberCenterStore } from 'src/core/stores/member-center'

/**
 * Get member center order record
 */
async function httpsGetMemberCenterOrderRecord() {
  try {
    const { setAuthLimit, setUserDataVo, setUserSubscription } =
      useMemberCenterStore()
    const { data } = await https.get<GetMemberCenterOrderRecordResponse>(
      API.MEMBER_CENTER.REQUEST_MEMBER_ORDER_RECORD
    )
    if (data?.code === RESPONSE_CODE.SUCCESS) {
      setAuthLimit(data?.data?.authLimit)
      setUserDataVo(data?.data?.userDataVo)

      const { expireTime, expireDateOfDay, startTime, status, authLimit } =
        data?.data
      setUserSubscription({
        expireDateOfDay,
        expireTime,
        startTime,
        status,
        type: authLimit?.type,
        typeNote: authLimit?.typeNote,
      })
    }
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

async function httpsGetSubscriptionRecords() {
  try {
    const { data } = await https.get<GetSubscriptionRecordsResponse>(
      API.MEMBER_CENTER.GET_SUBSCRIPTION_RECORDS
    )
    return data
  } catch (error) {
    errorHandler.log(error)
  }
}

export { httpsGetMemberCenterOrderRecord, httpsGetSubscriptionRecords }
