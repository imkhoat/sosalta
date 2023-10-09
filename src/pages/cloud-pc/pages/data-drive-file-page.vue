<template>
  <div
    flat
    class="team-files-page"
  >
    <file-system-entries
      :file-system-type="'DATA_DRIVE_FILE_SYSTEM'"
      page-title="Data Drive"
      page-subtitle="Store the files and folders within the data drive of the corresponding CloudPC instance."
    >
      <template
        v-if="!getActiveUserInformation"
        #empty
      >
        <div class="column justify-center items-center q-pa-xl q-my-xl">
          <q-avatar
            size="80px"
            color="grey-1"
          >
            <q-avatar
              size="60px"
              color="grey-3"
            >
              <q-icon
                name="sym_o_inventory_2"
                color="primary"
              ></q-icon>
            </q-avatar>
          </q-avatar>
          <strong class="text-weight-bold text-h6">Welcome!</strong>
          <span class="text-body2 text-disable text-center">
            Welcome to view data drive feature.
            <br />Please select data drive on left column to view detail files
          </span>
        </div>
      </template>
    </file-system-entries>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { computed, ref } from 'vue'
import FileSystemEntries from 'src/pages/file-system/components/file-system-entries.vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { UserInfo } from 'src/core/types/user-info'
import { useNavigate } from 'src/pages/file-system/hooks/use-navigate'

// composable
const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const { getActiveUserInformation } = storeToRefs(useFileSystemStore())
const { setActiveUserInfo } = useFileSystemStore()

// data
const activeTab = ref(getActiveUserInformation.value?.userName)
const users = ref<UserInfo[]>()
// computed
const isMobile = computed(() => {
  return $q.screen.lt.md
})

const isMemberUserSelected = computed(() => {
  return !!users.value?.find((item: UserInfo) => {
    return item.userName === getActiveUserInformation.value?.userName
  })
})

const teamId = computed(() => {
  return route.params.teamId?.toString() || activeTeam.value?.groupId || ''
})

// methods
function onSelectUser(user: UserInfo) {
  setActiveUserInfo(user)

  const { generateFileSystemRoutePath } = useNavigate()
  const { getDefaultRootFolder, getRootFolderId, getActiveUserName } =
    storeToRefs(useFileSystemStore())

  router.push({
    path: route.path,
    params: { ...route.params },
    query: {
      ...route.query,
      path: generateFileSystemRoutePath(
        getActiveUserName.value || '',
        getDefaultRootFolder.value.get(getRootFolderId.value)
      ),
    },
  })
}
</script>
<style lang="scss">
.team-files-page {
  &__empty {
    min-height: 70vh;
  }
}
</style>
