export enum SHARE_FILE_STATUS {
  WAITING = '0',
  ACCEPTED = '2',
  REJECTED = '1',
}

export type ShareFileStatus = `${SHARE_FILE_STATUS}`
export interface UserNotification {
  receiverFlag: string | boolean | null
  title: string
  shareFileStatus: ShareFileStatus
  content: string
  contentFormated?: {
    fileId: string
    fileName: string
    fileSize: string | number
    registerContent: string
  }
  flag: boolean
  receiver: string
  createdTime: string
  type: 'register' | 'share'
  id: string
  sender: {
    userName: string
    trueName: string
  }
  createdTimeString?: string
}
