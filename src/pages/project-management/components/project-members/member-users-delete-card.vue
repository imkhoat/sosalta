<template>
  <q-card class="member-users-delete-card">
    <q-card-section>
      <q-section-header title="Remove member"></q-section-header>
    </q-card-section>
    <q-card-section>
      <span v-html="deleteAlertMessage"></span>
    </q-card-section>
    <q-card-section class="column justify-start items-stretch bg-grey-1">
      <span class="text-caption text-disable">Remove to below users</span>
      <q-checkbox
        v-for="(user, index) in removeUsers"
        :key="index + '__member-users-delete-card'"
        :model-value="true"
        :label="user.userName"
        readonly
        disable
      ></q-checkbox>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjects } from 'src/pages/project-management/hooks/use-projects'
import { useProjectMembers } from 'src/pages/project-management/hooks/use-members'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])
const props = defineProps<{
  deleteType: 'DELETE_MEMBER_MODAL' | 'DELETE_MEMBERS_MODAL'
}>()
// composables
const { t } = useI18n()
const route = useRoute()
const { activeProject } = useProjects()
const { selectUsers, activeUser, handleRemoveProjectMembers, loading } =
  useProjectMembers()

// computed
const removeUsers = computed(() => {
  return props.deleteType === 'DELETE_MEMBERS_MODAL'
    ? selectUsers.value
    : [activeUser.value]
})
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Confirm'),
      action: onDeleteObject,
      loading: loading.value,
    },
  ]
})

const deleteAlertMessage = computed(() => {
  if (props.deleteType === 'DELETE_MEMBER_MODAL') {
    return `Do you want to remove <span class="text-weight-bold text-negative">${activeUser.value?.userName}</span> member?`
  } else {
    return `Do you want to remove those <span class="text-weight-bold text-negative">${selectUsers.value?.length}</span> members?`
  }
})

const projectId = computed(() => {
  return route.params?.projectId.toString() ?? activeProject.value?.projectId
})

// methods
function onClose() {
  emits('close')
}

async function onDeleteObject() {
  try {
    let deleteUsers: string[] = []

    if (props.deleteType === 'DELETE_MEMBER_MODAL') {
      deleteUsers = activeUser.value ? [activeUser.value?.userName] : []
    } else {
      deleteUsers = selectUsers.value?.map((item) => {
        return item?.userName
      })
    }

    await handleRemoveProjectMembers(deleteUsers, parseInt(projectId.value))
    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.member-users-delete-card {
  width: 380px;
}
</style>
