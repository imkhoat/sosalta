<template>
  <q-card
    flat
    class="note-view-draw q-pa-sm bg-grey-1 full-height rounded-borders"
  >
    <q-card-section>
      <q-img
        :src="imageBase64Data"
        spinner-color="white"
        fit="scale-down"
        class="full-width"
      ></q-img>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Note } from 'src/core/types/note-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import { GetObjectCommandOutput } from '@aws-sdk/client-s3'
import { computedAsync } from '@vueuse/core'

// composable
const { handleAwsGetFileDetail } = useProjectNotes()
//props
const props = defineProps<{
  item: Note
  expand: boolean
}>()

// data
const loading = ref(false)
const streamData = ref<GetObjectCommandOutput | null>()

// computed
const imageBase64Data = computedAsync(async () => {
  return await renderToTxt()
})

async function renderToTxt() {
  try {
    loading.value = true
    const stream = await streamData?.value?.Body?.transformToByteArray()
    const data = await base64FromArrayBuffer(stream)

    return `data:image/png};base64, ${data}`
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
const noteContent = computed(() => {
  const content = JSON.parse(props?.item?.noteValue.toString()) as {
    value: string
  }[]
  return content[0]?.value
})

// methods
async function onFetchingData() {
  try {
    loading.value = true

    const responseData = await handleAwsGetFileDetail(props.item?.s3FileKey)
    streamData.value = await responseData
  } catch (error) {
  } finally {
    loading.value = false
  }
}

onFetchingData()
</script>
