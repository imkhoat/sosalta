import {
  CreateMultipartUploadCommand,
  CreateMultipartUploadCommandInput,
  CompleteMultipartUploadCommandInput,
  S3Client,
  S3ClientConfig,
  CompleteMultipartUploadCommand,
  CompletedPart,
  AbortMultipartUploadCommandInput,
  AbortMultipartUploadCommand,
  UploadPartCommandInput,
  UploadPartCommand,
  GetObjectCommandInput,
  GetObjectAclCommandInput,
  GetObjectCommand,
} from '@aws-sdk/client-s3'

let s3Client: S3Client

export function useAWSS3() {
  function awsInitS3Client(params: S3ClientConfig) {
    const s3ConstructorParams: S3ClientConfig = {
      ...params,
      region: params?.region || process.env.AWS_REGION_CONFIG,
    }

    s3Client = new S3Client(s3ConstructorParams)
  }

  function awsDestroyS3Client() {
    s3Client.destroy()
  }

  async function awsCreateMultipartUpload(
    bucketName: string,
    s3FileKey: string,
    userName: string
  ) {
    try {
      const comandParams: CreateMultipartUploadCommandInput = {
        Bucket: bucketName,
        Key: s3FileKey,
        Tagging: encodeURI(`userName=${userName}&storageClassFrom=S`),
      }
      const comand = new CreateMultipartUploadCommand(comandParams)
      const response = await s3Client.send(comand)

      return response
    } catch (error) {
      console.log('awsCreateMultipartUpload', error)
      throw error
    }
  }

  async function awsUploadPart(
    bucketName: string,
    s3FileKey: string,
    partNumber: number,
    uploadId: string,
    fileContent: string | Blob | undefined
  ) {
    try {
      const comandParams: UploadPartCommandInput = {
        Bucket: bucketName,
        Key: s3FileKey,
        PartNumber: partNumber,
        UploadId: uploadId,
        Body: fileContent,
      }

      const comand = new UploadPartCommand(comandParams)

      const response = await s3Client.send(comand)

      return response
    } catch (error) {
      throw error
    }
  }

  async function awsCompletedMultipartUpload(
    bucketName: string,
    s3FileKey: string,
    parts: CompletedPart[],
    uploadId: string
  ) {
    try {
      const comandParams: CompleteMultipartUploadCommandInput = {
        Bucket: bucketName,
        Key: s3FileKey,
        MultipartUpload: {
          Parts: parts,
        },
        UploadId: uploadId,
      }

      const comand = new CompleteMultipartUploadCommand(comandParams)

      const response = await s3Client.send(comand)

      return response
    } catch (error) {
      throw error
    }
  }

  async function awsAbortMultipartUpload(
    bucketName: string,
    s3FileKey: string,
    uploadId: string
  ) {
    try {
      const comandParams: AbortMultipartUploadCommandInput = {
        Bucket: bucketName,
        Key: s3FileKey,
        UploadId: uploadId,
      }

      const comand = new AbortMultipartUploadCommand(comandParams)

      const response = await s3Client.send(comand)

      return response
    } catch (error) {
      throw error
    }
  }

  function awsGetSignedUrl() {
    console.log('awsGetSignedUrl')
  }

  async function awsGetObject(bucketName: string, s3FileKey: string) {
    try {
      const comandParams: GetObjectCommandInput = {
        Bucket: bucketName,
        Key: s3FileKey,
      }

      const comand = new GetObjectCommand(comandParams)
      const response = await s3Client.send(comand)
      return response
    } catch (error) {
      throw error
    }
  }

  function awsListParts() {
    console.log('awsListParts')
  }

  return {
    s3Client,
    awsInitS3Client,
    awsDestroyS3Client,
    awsCreateMultipartUpload,
    awsUploadPart,
    awsCompletedMultipartUpload,
    awsAbortMultipartUpload,
    awsGetSignedUrl,
    awsGetObject,
    awsListParts,
  }
}
