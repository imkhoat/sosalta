<template>
  <q-card
    :loading="loading"
    class="file-system-share-card"
  >
    <q-form
      ref="fileSystemShareCard"
      no-error-focus
      :autofocus="false"
      @submit="onShareObject"
    >
      <q-card-section>
        <q-section-header
          title="Share file"
          sub-title="Select members to receive share files"
        ></q-section-header>
      </q-card-section>
      <q-card-section v-if="loading">
        <q-skeleton
          type="text"
          width="30%"
          class="text-caption"
        />
        <q-skeleton
          type="text"
          class="text-subtitle1"
        />
        <q-skeleton
          type="text"
          class="text-subtitle1 q-mb-md"
        />
        <q-skeleton
          type="text"
          width="30%"
          class="text-caption"
        />
        <q-skeleton
          type="text"
          class="text-subtitle1"
        />
        <q-skeleton
          type="text"
          class="text-subtitle1"
        />
        <q-skeleton
          type="text"
          class="text-subtitle1"
        />
        <q-skeleton
          type="text"
          class="text-subtitle1"
        />
      </q-card-section>
      <q-card-section v-else>
        <span class="text-disable text-caption">Friends</span>
        <div class="column justify-start items-stretch q-mb-md">
          <q-checkbox
            v-for="(friend, friendIndex) in friends"
            :key="friendIndex + 'file-system-info-card__member'"
            v-model="selectedUsers"
            :val="friend.friend"
            :label="friend.friend"
          ></q-checkbox>
        </div>
        <span class="text-disable text-caption">Members</span>
        <div class="column justify-start items-stretch">
          <q-checkbox
            v-for="(member, memberIndex) in members"
            :key="memberIndex + 'file-system-info-card__member'"
            v-model="selectedUsers"
            :val="member.userName"
            :label="member.userName"
          ></q-checkbox>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ActionProp } from 'src/core/types/action-prop-types'

import { FriendUser, MemberUser } from 'src/core/types/services/user-types'
import { useFiles } from 'src/pages/file-system/hooks/use-files'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'

import {
  httpsGetMemberUsers,
  httpsGetFriendUsers,
} from 'src/core/services/user-services'
import { errorHandler } from 'src/core/utils/error-handler'

// props & emits
const emits = defineEmits(['close', 'rename'])
const props = defineProps<{
  shareType: 'SHARE_MODAL' | 'SHARE_ACTIVE_MODAL'
}>()

// composables
const { t } = useI18n()
const { handleShareObject, handleShareActiveObject, loading } = useFiles()

// data
const friends = ref<FriendUser[]>([])
const members = ref<MemberUser[]>([])

const selectedUsers = ref([])

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      mode: 'submit',
      color: 'primary',
      flat: true,
      name: t('textActions.Share'),
      loading: loading.value,
    },
  ]
})

// methods
async function fetchFriendList() {
  try {
    loading.value = true
    const data = await httpsGetFriendUsers()

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      friends.value = data.data
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

async function fetchMemberList() {
  try {
    loading.value = true
    const data = await httpsGetMemberUsers()

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      members.value = data.data
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function onClose() {
  emits('close')
}

async function onShareObject() {
  try {
    if (selectedUsers.value?.length <= 0) {
      errorHandler.notify('Please select users')
      return
    }
    if (props.shareType === 'SHARE_ACTIVE_MODAL') {
      await handleShareActiveObject(selectedUsers.value)
    } else {
      await handleShareObject(selectedUsers.value)
    }
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

// hook
onMounted(() => {
  Promise.all([fetchMemberList(), fetchFriendList()])
})
</script>
<style lang="scss">
.file-system-share-card {
  min-width: 300px;
}
</style>
