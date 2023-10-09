<template>
  <div class="recycle-bin-page">
    <file-system-entries
      page-title="Deleted Items"
      page-subtitle="Check your trash and restore deleted file."
      :hidden-filter="true"
    ></file-system-entries>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'src/core/stores/auth'
import { useFileSystemStore } from 'src/core/stores/file-system'
import FileSystemEntries from 'src/pages/file-system/components/file-system-entries.vue'

const router = useRouter()
const route = useRoute()
const { getUserInformation } = storeToRefs(useAuthStore())
const { setActiveUserInfo } = useFileSystemStore()

onMounted(() => {
  setActiveUserInfo(getUserInformation.value)
})
</script>
