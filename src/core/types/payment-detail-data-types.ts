export interface PaymentDetailData {
  monthlyFeeId: string
  outTradeNo: string
  month: string
  userName: string
  managerAnalysisFee: number
  managerAnalysisActualFee: number
  managerMachineFee: number
  managerStorageFee: number
  managerTransferFee: number
  waitPayFee: number
  managerMonthlyFee: number
  status: 'ESTIMATED'
  managerName: string
  s3FrequentOriginalFee: number
  s3InfrequentOriginalFee: number
  glacierOriginalFee: number
  transferOriginalFee: number
  ec2AndEbsOriginalFee: number
  serviceChargeOriginalFee: number
  serviceChargeCoins: number
  s3TransferServiceChargeActualFee: number
  appOriginalFee: number
  analysisCoins: number
  ec2AndEbsActualFee: number
}
