<template>
  <q-card
    :loading="loading"
    class="member-users-add-card"
  >
    <q-form
      ref="memberUserAddCard"
      no-error-focus
      :autofocus="false"
      @submit="onAddMembers"
    >
      <q-card-section>
        <q-section-header
          title="Add member"
          sub-title="Select members to be add in the project"
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
      <q-card-section v-else-if="members?.length > 0">
        <span class="text-disable text-caption">Members</span>
        <div class="column justify-start items-stretch">
          <q-checkbox
            v-for="(member, memberIndex) in members"
            :key="memberIndex + 'member-users-info-card__member'"
            v-model="selectedUsers"
            :val="member"
            :label="member.userName"
          ></q-checkbox>
        </div>
      </q-card-section>
      <q-card-section v-else>
        <q-alert>
          All members have been added to this project. You cannot add new
          members to the current project.
        </q-alert>
      </q-card-section>
      <q-card-actions align="right">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import { UserInfo } from 'src/core/types/user-info'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjectMembers } from 'src/pages/project-management/hooks/use-members'
import { ProjectMember } from 'src/core/types/project-member-types'

// props & emits
const emits = defineEmits(['close', 'refresh'])
const props = defineProps<{
  projectId: string | number
}>()

// composables
const { t } = useI18n()
const { handleAddNewMembers, handleGetUnProjectMembers, loading } =
  useProjectMembers()

// data
const members = ref<UserInfo[] | ProjectMember[]>([])
const selectedUsers = ref<UserInfo[] | ProjectMember[]>([])

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
      disable: members?.value?.length === 0,
      name: t('textActions.Add'),
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

async function onAddMembers() {
  try {
    if (selectedUsers.value?.length <= 0) {
      errorHandler.notify('Please select members')
      return
    }

    const selectedMembers = selectedUsers.value.map((item) => {
      return item?.userName
    })

    const result = await handleAddNewMembers(
      selectedMembers,
      parseInt(props.projectId.toString())
    )
    if (result) {
      emits('refresh')
      emits('close')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

async function onFetchingData() {
  try {
    members.value = await handleGetUnProjectMembers(props.projectId)
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

// hook
onMounted(() => {
  onFetchingData()
})
</script>
<style lang="scss">
.member-users-add-card {
  min-width: 300px;
}
</style>
