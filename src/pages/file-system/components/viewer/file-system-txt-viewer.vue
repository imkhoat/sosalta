<template>
  <pre
    v-if="!loading"
    class="file-system-txt-viewer q-border-bold q-pa-sm rounded-borders"
  >
    {{ txtData }}
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

const txtData = computedAsync(async () => {
  return await renderToTxt()
})

async function renderToTxt() {
  try {
    loading.value = true
    return await props.data?.Body?.transformToString()
  } catch (error) {
  } finally {
    loading.value = false
  }
}
</script>
<style lang="scss">
.file-system-txt-viewer {
  min-height: 300px;
  line-height: 14px;
}
</style>
