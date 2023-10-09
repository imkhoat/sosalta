export interface EncryptionKey {
  userName: string
  createdAt: string | Date
  symmetricKey: string
  name: string
  keyIndex: number
  type: '1'
}
