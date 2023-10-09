<template>
  <div
    flat
    class="member-files-page"
  >
    <file-system-entries
      page-title="Member Files"
      page-subtitle="Access and manipulate documents within your member account."
    >
      <template
        #sidebar
        v-if="users?.length && users?.length > 0"
      >
        <q-tabs
          v-model="activeTab"
          :vertical="!isMobile"
          :mobile-arrows="false"
          active-bg-color="grey-4"
          class="q-pa-md bg-white rounded-borders"
          content-class="bg-grey-1 no-border-radius"
        >
          <q-tab
            v-for="(tab, tabIndex) in users"
            :key="tabIndex + '_account-setting-tab'"
            :name="tab.userName"
            :label="tab.userName"
            class="account-setting-page__tab overflow-hidden"
            :active-class="'bg-grey-4 text-weight-bold'"
            content-class="account-setting-page__tab-content text-capitalize"
            @click="onSelectUser(tab)"
          />
        </q-tabs>
      </template>
      <template
        #empty
        v-if="
          !getActiveUserInformation || !users?.length || users?.length === 0
        "
      >
        <select-member-card v-if="!getActiveUserInformation" />
        <no-member-data-card v-if="!users?.length || users?.length === 0" />
      </template>
    </file-system-entries>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UserInfo } from 'src/core/types/user-info'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { useMemberSettings } from '../hooks/use-member-settings'
import { useNavigate } from 'src/pages/file-system/hooks/use-navigate'
import FileSystemEntries from 'src/pages/file-system/components/file-system-entries.vue'
import SelectMemberCard from 'src/pages/member-users/components/member-files/select-member-card.vue'
import NoMemberDataCard from 'src/pages/member-users/components/member-files/no-member-data-card.vue'
// composable
const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const { getActiveUserInformation } = storeToRefs(useFileSystemStore())
const { setActiveUserInfo, setParentId } = useFileSystemStore()
const { users, onFetchingData } = useMemberSettings()

// data
const activeTab = ref(getActiveUserInformation.value?.userName)

// computed
const isMobile = computed(() => {
  return $q.screen.lt.md
})

// methods
function onSelectUser(user: UserInfo) {
  setActiveUserInfo(user)
  setParentId(user.userName)

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
async function onFetchingMemberData() {
  await onFetchingData()
  if (users.value && users.value?.length > 0) {
    activeTab.value = users.value[0].userName
    onSelectUser(users.value[0])
  }
}

onFetchingMemberData()
</script>
<style lang="scss">
.member-files-page {
  &__empty {
    min-height: 70vh;
  }
}
</style>
