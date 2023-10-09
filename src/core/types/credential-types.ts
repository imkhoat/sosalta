export interface Credential {
  accessKeyId: string | undefined
  secretAccessKey: string | undefined
  sessionToken: string | undefined
  expiration: string | Date
  bucket: string | undefined
  region: string | undefined
  writable: boolean
}
