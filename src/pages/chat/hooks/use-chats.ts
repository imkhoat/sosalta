import { storeToRefs } from 'pinia'
import {
  socketInit,
  socketQueryEntry,
  pomelo,
  socketEnter,
} from 'src/core/services/chat-services'
import { useAuthStore } from 'src/core/stores/auth'
import { ref } from 'vue'

const CHAT_HOST = `${process.env.CHAT_HOST}`
const CHAT_PORT = `${process.env.CHAT_PORT}`

export function useChats() {
  const { getUserName } = storeToRefs(useAuthStore())
  const { setAuthenticationToken, getAuthenticationToken } = useAuthStore()

  const loading = ref(false)

  function queryEntry(
    uid: string | undefined,
    token: string | undefined,
    callback: (
      host: string | undefined,
      port: string | undefined,
      type: string | undefined
    ) => void
  ) {
    socketInit(CHAT_HOST, CHAT_PORT, 'gate').then(() => {
      const params = {
        uid: uid,
        token: token,
      }
      socketQueryEntry(params).then((data) => {
        pomelo.disconnect()
        if (data.token) {
          setAuthenticationToken(data.token)
        }
        if (CHAT_PORT == '443') {
          callback(CHAT_HOST, CHAT_PORT, data.type)
        } else {
          callback(CHAT_HOST, data.port, data.type)
        }
      })
    })
  }

  function initConnection(
    host: string | undefined,
    port: string | undefined,
    type: string | undefined
  ) {
    const token = getAuthenticationToken()
    const userName = getUserName.value ?? ''
    const getFriendsLastKey = ''
    socketInit(host, port, 'conn2').then(() => {
      const params = {
        userName: userName,
        token: token,
      }

      socketEnter(params).then((data) => {
        if (data.error) {
          return
        } else {
          const a = setInterval(() => {
            connector(token)
            if (token == undefined) {
              clearInterval(a)
            }
          }, 50000)
          getFriendsList(userName, token)
          getFriendsInviteMessages(userName, getFriendsLastKey)
          getGrouplist('group')
          setTimeout(() => getGrouplist('conversation'), 1000)
          setTimeout(() => getGrouplist('project'), 2000)
        }
      })
    })
  }

  function connector(token: string) {
    console.log(token)
  }
  function getFriendsList(userName: string, token: string) {
    console.log(userName, token)
  }
  function getFriendsInviteMessages(
    userName: string,
    getFriendsLastKey: string
  ) {
    console.log(userName, getFriendsLastKey)
  }
  function getGrouplist(type: 'group' | 'conversation' | 'project') {
    console.log(type)
  }

  return {
    loading,
    queryEntry,
    initConnection,
    connector,
    getFriendsList,
    getFriendsInviteMessages,
    getGrouplist,
  }
}
