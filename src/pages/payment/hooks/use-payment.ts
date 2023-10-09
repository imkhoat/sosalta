import format from 'date-fns/format'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import {
  httpsGetBilledTotal,
  httpsGetPaymentDetails,
  httpsGetPaymentHistory,
  httpsGetTotalBalance,
  httpsGetTotalCoinAmount,
} from 'src/core/services/payment-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { usePaginationStore } from 'src/core/stores/pagination'
import { TablePagination } from 'src/core/types/pagging-types'
import {
  PAYMENT_HISTORY_METHOD,
  PAYMENT_HISTORY_ORDER_STATUS,
  PAYMENT_HISTORY_TYPE,
  SUBSCRIPTION_TYPE,
} from 'src/core/types/payment-history-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PaymentHistory } from 'src/core/types/payment-history-types'
import { convertCurrencyToUSD } from 'src/core/utils/currency-convert'
import { usePaymentHistoryStore } from 'src/core/stores/payment'
import { PAYMENT_ROUTE_NAMES } from 'src/core/router/routes'

export function usePayment() {
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { resetPagination, updatePagination } = usePaginationStore()
  const { pagination } = storeToRefs(usePaginationStore())
  const { updatePaymentHistory } = usePaymentHistoryStore()

  //reset state
  resetPagination()

  // data
  const loading = ref(false)

  // methods

  function onUpdateActiveHistory(invoice: PaymentHistory) {
    updatePaymentHistory(invoice)
  }

  async function handleGetTotalCoinAmount() {
    try {
      loading.value = true

      const data = await httpsGetTotalCoinAmount()
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data
      }
      return 0
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return 0
    } finally {
      loading.value = false
    }
  }
  async function handleGetBilledTotal() {
    try {
      loading.value = true

      const data = await httpsGetBilledTotal()
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.sumWaitPayFee
      }
      return 0
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return 0
    } finally {
      loading.value = false
    }
  }

  async function handleGetTotalBalance() {
    try {
      loading.value = true

      const data = await httpsGetTotalBalance()
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data
      }
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleGetPaymentHistory(
    currentPaging?: TablePagination,
    filter?: {
      status?: string | null
      keyword?: string
    }
  ) {
    try {
      loading.value = true

      if (!filter?.status) {
        delete filter?.status
      }
      if (!filter?.keyword) {
        delete filter?.keyword
      }
      const data = await httpsGetPaymentHistory({
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        page: currentPaging?.page ?? pagination.value?.page,
        ...filter,
      })

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        updatePagination({
          rowsPerPage: data?.data.pageSize,
          page: data?.data?.currPage,
          rowsNumber: data?.data?.totalCount,
        })
        return data?.data?.list.map((item) => {
          return {
            ...item,
            orderStatusString:
              item.orderStatus === PAYMENT_HISTORY_ORDER_STATUS.TRADE_SUCCESS
                ? 'Completed'
                : 'Failed',
            isCompletedStatus:
              item.orderStatus === PAYMENT_HISTORY_ORDER_STATUS.TRADE_SUCCESS,
            payMethodString:
              item.payMethod === PAYMENT_HISTORY_METHOD.WALLET_PAY
                ? 'Paid by Wallet Cash Balance'
                : `${item.payMethod} <br/> <span class="text-disable">${
                    item.referenceId ?? ''
                  }</span>`,
            coinString: item?.coinsAmount ?? '-',
            typeString:
              Number(item?.type) === PAYMENT_HISTORY_TYPE.ADD_ACCOUNT_FUND
                ? 'Add Account Fund'
                : Number(item.memberOrder?.status) === SUBSCRIPTION_TYPE.RENEW
                ? 'Subscription Renewal'
                : 'Subscription Upgrade',
            detailPayment:
              Number(item?.type) === PAYMENT_HISTORY_TYPE.ADD_ACCOUNT_FUND
                ? '-'
                : _generatePaymentDescription(item),
            originalPriceString: `${
              Math.sign(item?.primeAmount ?? 0) === -1 ? 'Refund' : ''
            }${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(item?.primeAmount / 100)}`,
            totalPriceString: `${
              Math.sign(item?.primeAmount ?? 0) === -1 ? 'Refund' : ''
            }${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(item?.totalAmount / 100)}`,
            gmtLoggingTimeString: format(
              new Date(Number(item.gmtCreate) || ''),
              'MMM dd, yyyy hh:mm'
            ).toString(),
          }
        })
      }
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleGetPaymentDetails(currentPaging?: TablePagination) {
    try {
      loading.value = true

      const data = await httpsGetPaymentDetails({
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        page: currentPaging?.page ?? pagination.value?.page,
      })

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        updatePagination({
          rowsPerPage: data?.data.pageSize,
          page: data?.data?.currPage,
          rowsNumber: data?.data?.totalCount,
        })
        return data?.data?.list.map((item) => {
          return {
            ...item,
            monthString: format(
              new Date(
                Number(item.month.substring(0, 4)),
                Number(item.month.substring(4, 6)) - 1
              ),
              'MMM, yyyy'
            ),
            managerMonthlyFeeString: convertCurrencyToUSD(
              item.managerMonthlyFee / 100
            ),
            alreadyPaidString: convertCurrencyToUSD(
              (item.managerMonthlyFee - item.waitPayFee) / 100
            ),
            unPaidString: convertCurrencyToUSD(item.waitPayFee / 100),
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

  function _generatePaymentDescription(item: PaymentHistory) {
    switch (item?.memberOrder?.expireDateOfDay) {
      case 30:
        return `${item.noteType} Membership / 1-month subscription <br/> <span class="text-disable">(${item.memberOrder?.expireDateOfDay} days)</span>`
      case 60:
        return `${item.noteType} Membership / 2-months subscription <br/> <span class="text-disable">(${item.memberOrder?.expireDateOfDay} days)</span>`
      case 90:
        return `${item.noteType} Membership / 3-months subscription <br/> <span class="text-disable">(${item.memberOrder?.expireDateOfDay} days)</span>`
      case 365:
        return `${item.noteType} Membership / 1-year subscription <br/> <span class="text-disable">(${item.memberOrder?.expireDateOfDay} days)</span>`
      case 1065:
        return `${item.noteType} Membership / 3-year subscription <br/> <span class="text-disable">(${item.memberOrder?.expireDateOfDay} days)</span>`
      default:
        return `${item.noteType} Membership / ${item.memberOrder?.expireDateOfDay}-days subscription <br/> <span class="text-disable">(${item.memberOrder?.expireDateOfDay} days)</span>`
    }
  }

  return {
    loading,
    pagination,
    handleGetPaymentDetails,
    handleGetPaymentHistory,
    handleGetTotalBalance,
    handleGetBilledTotal,
    handleGetTotalCoinAmount,
    onUpdateActiveHistory,
  }
}
