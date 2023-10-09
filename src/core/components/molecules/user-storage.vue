<template>
  <div class="row justify-center">
    <q-circular-progress
      v-if="mini"
      show-value
      :angle="0"
      :value="100 - getRemainingStorageByPercent"
      size="30px"
      :thickness="0.22"
      :min="0"
      :max="100"
      color="primary"
      track-color="grey-3"
      >{{ getRemainingStorageByPercentText }}</q-circular-progress
    >
    <q-card
      v-else
      flat
      class="bg-grey-1 full-width"
    >
      <q-card-section>
        <div class="text-subtitle2 text-weight-bold">Used space</div>
        <div class="text-caption">
          You has used {{ getRemainingStorageByPercentText }} of your available
          space
        </div>
        <q-linear-progress
          :value="100 - getRemainingStorageByPercent"
          :min="0"
          :max="100"
          rounded
          class="q-mt-md"
        >
          <q-tooltip>{{ getCapacityStorageByGB }}</q-tooltip>
        </q-linear-progress>
      </q-card-section>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import useGeneral from 'src/core/composables/use-storage'
import { storeToRefs } from 'pinia'
import { useUserStorageStore } from 'src/core/stores/user-storage-stores'

// composables
const { onGetUserStorage } = useGeneral()
const {
  getCapacityStorageByGB,
  getRemainingStorageByPercent,
  getRemainingStorageByPercentText,
} = storeToRefs(useUserStorageStore())

// props
defineProps<{
  mini: boolean
}>()

onMounted(() => {
  onGetUserStorage()
})
</script>
