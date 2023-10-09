import { AwsCredentialIdentity } from '@aws-sdk/types'

export interface S3ClientRequest {
  credentials: AwsCredentialIdentity
}
