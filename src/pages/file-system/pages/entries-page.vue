<template>
  <div class="file-system-page">
    <file-system-entries
      page-title="My Files"
      page-subtitle="Store and share your documents. Utilize encrypt folder to store confidential documents securely."
      table-title="Uploaded files"
      table-subtitle="Use checkbox to select file and click button to edit."
    ></file-system-entries>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { onMounted } from 'vue'
import FileSystemEntries from 'src/pages/file-system/components/file-system-entries.vue'

const { getUserInformation } = storeToRefs(useAuthStore())
const { setActiveUserInfo } = useFileSystemStore()

onMounted(() => {
  setActiveUserInfo(getUserInformation.value)
})
</script>
