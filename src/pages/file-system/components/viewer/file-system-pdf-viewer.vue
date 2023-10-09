<template>
  <pre class="file-system-pdf-viewer q-border q-pa-sm rounded-borders">
    {{ pdfData }}
  </pre>
</template>
<script lang="ts" setup>
import { StorageFile } from 'src/core/types/file-types'
import { GetObjectCommandOutput } from '@aws-sdk/client-s3'
import { computedAsync } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps<{
  data: GetObjectCommandOutput | null | undefined
  item?: StorageFile
}>()

const loading = ref(false)

const pdfData = computedAsync(async () => {
  return await renderToPdf()
})

async function renderToPdf() {
  try {
    loading.value = true
    return props.data?.Body?.transformToWebStream()
  } catch (error) {
  } finally {
    loading.value = false
  }
}
</script>
<style lang="scss">
.file-system-pdf-viewer {
  min-height: 300px;
  line-height: 14px;
}
</style>
