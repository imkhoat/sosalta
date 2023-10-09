<template>
  <div class="file-system-txt-viewer q-border-bold q-pa-sm rounded-borders">
    <q-img
      :fit="'contain'"
      :src="txtData"
    />
  </div>
</template>
<script lang="ts" setup>
import { StorageFile, STORAGE_FILE_TYPE } from 'src/core/types/file-types'
import { GetObjectCommandOutput } from '@aws-sdk/client-s3'
import { computedAsync } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps<{
  data: GetObjectCommandOutput | null | undefined
  item?: StorageFile
}>()

const loading = ref(false)

const txtData = computedAsync(async () => {
  return await renderToTxt()
})

async function renderToTxt() {
  try {
    loading.value = true
    const stream = await props.data?.Body?.transformToByteArray()
    const data = await base64FromArrayBuffer(stream)

    return `data:image/${
      props.item?.fileType === STORAGE_FILE_TYPE.SVG
        ? 'svg+xml'
        : props.item?.fileType
    };base64, ${data}`
  } catch (error) {
  } finally {
    loading.value = false
  }
}
async function base64FromArrayBuffer(data: Uint8Array | undefined) {
  // Use a FileReader to generate a base64 data URI
  const base64url: any = await new Promise((r) => {
    const reader = new FileReader()
    reader.onload = () => r(reader.result)
    reader.readAsDataURL(new Blob([data]))
  })
  return base64url.substring(base64url.indexOf(',') + 1)
}
</script>
<style lang="scss">
.file-system-txt-viewer {
  min-height: 100px;
  height: fit-content;
  line-height: 14px;
}
</style>
