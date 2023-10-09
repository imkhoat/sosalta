import { API } from './utils/apis'
import { pomelo } from 'src/core/utils/pomelo'
import {
  SocketQueryEntryResponse,
  SocketEnterResponse,
} from 'src/core/types/services/chat-types'
const CHAT_HOST = `${process.env.CHAT_HOST}`
const CHAT_PORT = `${process.env.CHAT_PORT}`

window.pomelo = pomelo

function socketInit(host?: string, port?: string, type = 'gate') {
  return new Promise(
    (resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
      pomelo.init(
        {
          host: host ?? CHAT_HOST,
          port: port ?? CHAT_PORT,
          type: type,
          log: true,
        },
        function () {
          resolve()
        }
      )
    }
  )
}

function socketEnter(params: { userName: string; token: string }) {
  return new Promise<SocketEnterResponse>((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.ENTER,
      {
        userName: params.userName,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}

function socketQueryEntry(params: { uid: string; token: string }) {
  return new Promise<SocketQueryEntryResponse>((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.QUERY_ENTRY,
      {
        uid: params.uid,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}

function socketGetFriendsList(params: { userName: string; token: string }) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.GET_FRIENDS_LIST,
      {
        userName: params.userName,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
function socketUpdateNickNameApi(params: {
  userName: string
  friend: string
  nickName: string
  token: string
}) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.UPDATE_NICK_NAME,
      {
        friend: params.friend,
        userName: params.userName,
        nickName: params.nickName,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}

function socketFindUser(params: {
  searchContent: string
  userName: string
  token: string
}) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.FIND_USER,
      {
        searchContent: params.searchContent,
        userName: params.userName,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}

/**
 *
 * Function: Send friend request
 */
function socketPushFriendInvite(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.PUSH_FRIEND_INVITE,
      {
        target: params.target,
        note: params.note,
        userName: params.userName,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Agree to friend request
 */
function socketAgreeFriendInvite(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.AGREE_FRIEND_INVITE,
      {
        id: params.id,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Ignore friend request
 */
function socketIgnoreFriendInvite(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.IGNORE_FRIEND_INVITE,
      {
        id: params.id,
        userName: params.userName,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Get friend application
 */
function socketGetFriendsInviteMessages(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.GET_FRIENDS_INVITE_MESSAGES,
      {
        lastEvaluatedKey: params.lastEvaluatedKey,
        userName: params.userName,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Delete friends
 */
function socketDeleteFriends(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.DELETE_FRIENDS,
      {
        friend: params.friend,
        userName: params.userName,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Get chat history
 */
function socketGetChatMessages(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.GET_CHAT_MESSAGES,
      {
        target: params.target,
        lastEvaluatedKey: params.lastEvaluatedKey,
        userName: params.userName,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Update the unread status of the message
 */
function socketUpdateMessageById(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.UPDATE_MESSAGE_BY_ID,
      {
        id: params.id,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Send message
 */
function socketSend(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.SEND,
      {
        content: params.content,
        userName: params.userName,
        target: params.target,
        type: params.type,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Share files
 */
function socketShareFile(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.SHARE_FILE,
      {
        contents: params.content,
        receivers: params.receivers,
        type: params.type,
        sender: params.sender,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Accept documents
 */
function socketAcceptShareFile(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.ACCEPT_SHARE_FILE,
      {
        param: params.param,
        id: params.id,
        msgId: params.msgId,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Refuse to accept the file
 */
function socketRefuseShareFile(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.REFUSE_SHARE_FILE,
      {
        sender: params.sender,
        id: params.id,
        msgId: params.msgId,
        target: params.target,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Update connector
 */
function socketConnector(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PRIVATE_CHAT.CONNECTOR,
      {
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 * @param
 * Function: Initialization
 */
function socketEnterGroupChat(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.GROUP_CHAT.ENTER_GROUP_CHAT,
      {
        userName: params.userName,
        token: params.token,
        rid: params.rid, // groupId
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 * @param
 * Function: Initialization
 */
function socketEnterRoom2(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.GROUP_CHAT.ENTER_ROOM2,
      {
        userName: params.userName,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Get group chat information
 */
function socketPutUserIntoGroupAndAuth(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.GROUP_CHAT.PUT_USER_INTO_GROUP_AND_AUTH,
      {
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * function: Get group chat information
 */
function socketGetGroupAndAuth(params, type) {
  let getGroupAndAuth = ''
  if (type == 'group') {
    getGroupAndAuth = API.CHAT.GROUP_CHAT.GET_GROUP_AND_AUTH
  }
  if (type == 'conversation') {
    getGroupAndAuth = API.CHAT.CONVERSATION_CHAT.GET_CONVERSATION_LIST
  }
  if (type == 'project') {
    getGroupAndAuth = API.CHAT.PROJECT_CHAT.GET_PROJECT_LIST
  }
  return new Promise((resolve, reject) => {
    pomelo.request(
      getGroupAndAuth,
      {
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Get group information
 */
function socketGetLastMessage(params, type) {
  let getLastMessage = ''
  if (type == 'group') {
    getLastMessage = API.CHAT.GROUP_CHAT.GET_LAST_MESSAGE
  }
  if (type == 'conversation') {
    getLastMessage = API.CHAT.CONVERSATION_CHAT.GET_LAST_MESSAGE
  }
  return new Promise((resolve, reject) => {
    pomelo.request(
      getLastMessage,
      {
        token: params.token,
        groupId: params.groupId,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Get group chat chat history
 */
function socketGetGroupChatMessages(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.GROUP_CHAT.GET_GROUP_CHAT_MESSAGES,
      {
        groupId: params.groupId,
        lastEvaluatedKey: params.lastEvaluatedKey,
        limit: params.limit,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Get group member news
 */
function socketGetGroupAndAuthMembersInfo(params, type) {
  let getGroupAndAuthMembersInfo = ''
  if (type == 'group') {
    getGroupAndAuthMembersInfo =
      API.CHAT.GROUP_CHAT.GET_GROUP_AND_AUTH_MEMBERS_INFO
  }
  if (type == 'conversation') {
    getGroupAndAuthMembersInfo =
      API.CHAT.CONVERSATION_CHAT.GET_CONVERSATION_MEMBERS
  }
  return new Promise((resolve, reject) => {
    pomelo.request(
      getGroupAndAuthMembersInfo,
      {
        groupId: params.groupId,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Determine whether a group member is a friend
 */
function socketIsFriendGroup(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.GROUP_CHAT.IS_FRIEND,
      {
        userName: params.userName,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Determine whether a group member is a friend
 */
function socketSendGroupMessage(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.GROUP_CHAT.SEND_GROUP_MESSAGE,
      {
        content: params.content,
        groupId: params.groupId,
        type: params.type,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Modify group name
 */
function socketUpdateGroupName(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.GROUP_CHAT.UPDATE_GROUP_NAME,
      {
        groupId: params.groupId,
        groupName: params.groupName,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Modify group name
 */
function socketGetManagingUserList(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.GROUP_CHAT.GET_MANAGING_USER_LIST,
      {
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Change the status of the message
 */
function socketUpdateLastMessageId(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.GROUP_CHAT.UPDATE_LAST_MESSAGE_ID,
      {
        token: params.token,
        groupId: params.groupId,
        gMsgId: params.gMsgId,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Share group files
 */
function socketShareGroupFile(params, type) {
  let shareGroupFile = ''
  if (type == 'group') {
    shareGroupFile = API.CHAT.GROUP_CHAT.SHARE_GROUP_FILE
  }
  if (type == 'conversation') {
    shareGroupFile = API.CHAT.CONVERSATION_CHAT.SHARE_GROUP_FILE
  }
  return new Promise((resolve, reject) => {
    pomelo.request(
      shareGroupFile,
      {
        token: params.token,
        groupId: params.groupId,
        shareFileId: params.shareFileId,
        fileName: params.fileName,
        fileSize: params.fileSize,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Accept group files
 */
function socketAcceptGroupFile(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.GROUP_CHAT.ACCEPT_GROUP_FILE,
      {
        token: params.token,
        groupId: params.groupId,
        gMsgId: params.gMsgId,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Get group file list
 */
function socketGetGroupShareFile(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.GROUP_CHAT.GET_GROUP_SHARE_FILE,
      {
        token: params.token,
        groupId: params.groupId,
        lastEvaluatedKey: params.lastEvaluatedKey,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Get group member avatar and remarks
 */
function socketGetGroupMembersHeadImage(params, type) {
  let getGroupMembersHeadImage = ''
  if (type == 'group') {
    getGroupMembersHeadImage = API.CHAT.GROUP_CHAT.GET_GROUP_MEMBERS_INFO
  }
  if (type == 'conversation') {
    getGroupMembersHeadImage = API.CHAT.CONVERSATION_CHAT.GET_GROUP_MEMBERS_INFO
  }

  return new Promise((resolve, reject) => {
    pomelo.request(
      getGroupMembersHeadImage,
      {
        token: params.token,
        groupId: params.groupId,
        members: params.members,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}

/**
 *
 * Function: Create a new multi-person conversation/add group members for a multi-person conversation
 */
function socketAddUsersInGroupConversation(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.CONVERSATION_CHAT.ADD_USERS_IN_GROUP_CONVERSATION,
      {
        token: params.token,
        members: params.members,
        groupName: params.groupName,
        groupId: params.groupId,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}

/**
 *
 * Function: Send multi-person conversation information
 *
 */
function socketSendConversationMessage(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.CONVERSATION_CHAT.SEND_CONVERSATION_MESSAGE,
      {
        token: params.token,
        groupId: params.groupId,
        content: params.content,
        type: params.type,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Change the status of the message
 */
function socketUpdateLastMessageIdConver(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.CONVERSATION_CHAT.UPDATE_LAST_MESSAGE_ID_CONVER,
      {
        token: params.token,
        groupId: params.groupId,
        gMsgId: params.gMsgId,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Get member information of multi-person conversation list
 */
function socketGetConversationMembers(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.CONVERSATION_CHAT.GET_CONVERSATION_MEMBERS,
      {
        token: params.token,
        groupId: params.groupId,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Exit the multiplayer session
 */
function socketExistConversation(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.CONVERSATION_CHAT.EXIST_CONVERSATION,
      {
        token: params.token,
        groupId: params.groupId,
        groupName: params.groupName,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Modify multi-person conversation notes
 */
function socketUpdateRemarkName(params, type) {
  let updateRemarkName = ''
  if (type == 'group') {
    updateRemarkName = API.CHAT.GROUP_CHAT.UPDATE_REMARK_NAME
  }
  if (type == 'conversation') {
    updateRemarkName = API.CHAT.CONVERSATION_CHAT.UPDATE_REMARK_NAME
  }
  return new Promise((resolve, reject) => {
    pomelo.request(
      updateRemarkName,
      {
        token: params.token,
        groupId: params.groupId,
        remarkName: params.remarkName,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: file import
 */
function socketGetFileUploadProcess(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      getFileUploadProcess,
      {
        token: params.token,
        fileIds: params.fileIds,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
// -----------------------------Project--------------------------------------------
/**
 *
 * Function: Get project chat member information
 */
function socketGetProjectMembers(params, type) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PROJECT_CHAT.GET_PROJECT_MEMBER_LIST,
      {
        projectId: params.projectId,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: project session to send information
 */
function socketSendProjectMessage(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PROJECT_CHAT.SEND_MESSAGE,
      {
        token: params.token,
        projectId: params.projectId,
        content: params.content,
        type: params.type,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: share files in project session
 */
function socketShareProjectFile(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PROJECT_CHAT.SHARE_FILE,
      {
        token: params.token,
        projectId: params.projectId,
        shareFileId: params.shareFileId,
        fileName: params.fileName,
        fileSize: params.fileSize,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Update the last message of the project session
 */
function socketUpdateLastProMsgId(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PROJECT_CHAT.UPDATE_LAST_MSG_ID,
      {
        token: params.token,
        projectId: params.projectId,
        gMsgId: params.gMsgId,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Update the user's remark name in the project
 */
function socketUpdateProjectRemarkName(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PROJECT_CHAT.UPDATE_REMARK_NAME,
      {
        projectId: params.projectId,
        remarkName: params.remarkName,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}
/**
 *
 * Function: Get historical chat records
 */
function socketGetProjectChatMessages(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PROJECT_CHAT.GET_GROUP_CHAT_MESSAGES,
      {
        groupId: params.projectId,
        lastEvaluatedKey: params.lastEvaluatedKey,
        isTransfer: false,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}

/**
 *
 * Function: Receive shared files in the project
 */
function socketAcceptProjectFile(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PROJECT_CHAT.ACCEPT_GROUP_FILE,
      {
        groupId: params.projectId,
        gMsgId: params.gMsgId,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}

/**
 *
 * Function: Get the list of shared files of the project
 */
function socketGetProjectFileList(params) {
  return new Promise((resolve, reject) => {
    pomelo.request(
      API.CHAT.PROJECT_CHAT.GET_GROUP_SHARE_FILE,
      {
        groupId: params.projectId,
        isTransfer: false,
        token: params.token,
      },
      function (res) {
        resolve(res)
      }
    )
  })
}

export {
  pomelo,
  socketInit,
  socketEnter,
  socketQueryEntry,
  socketGetFriendsList,
  socketUpdateNickNameApi,
  socketFindUser,
  socketPushFriendInvite,
  socketAgreeFriendInvite,
  socketIgnoreFriendInvite,
  socketGetFriendsInviteMessages,
  socketDeleteFriends,
  socketGetChatMessages,
  socketUpdateMessageById,
  socketSend,
  socketShareFile,
  socketAcceptShareFile,
  socketRefuseShareFile,
  socketConnector,
  socketEnterGroupChat,
  socketEnterRoom2,
  socketPutUserIntoGroupAndAuth,
  socketGetGroupAndAuth,
  socketGetLastMessage,
  socketGetGroupChatMessages,
  socketGetGroupAndAuthMembersInfo,
  socketIsFriendGroup,
  socketSendGroupMessage,
  socketUpdateGroupName,
  socketGetManagingUserList,
  socketUpdateLastMessageId,
  socketShareGroupFile,
  socketAcceptGroupFile,
  socketGetGroupShareFile,
  socketGetGroupMembersHeadImage,
  socketSendProjectMessage,
  socketUpdateLastProMsgId,
  socketGetProjectChatMessages,
  socketUpdateProjectRemarkName,
  socketAcceptProjectFile,
  socketGetProjectFileList,
}
