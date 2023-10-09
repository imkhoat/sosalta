<template>
  <q-card
    flat
    outlined
    class="rounded-borders font-opensan"
  >
    <q-card-section
      class="column justify-start items-stretch q-gutter-y-md rounded-borders bg-white"
    >
      <div class="row justify-between items-start q-mt-none">
        <q-avatar
          size="36px"
          color="grey-1"
          text-color="primary"
          class="q-mt-none"
        >
          <q-avatar
            size="28px"
            color="grey-3"
            text-color="primary-4"
          >
            <q-icon
              size="24px"
              name="monetization_on"
            ></q-icon>
          </q-avatar>
        </q-avatar>
      </div>
      <span class="text-body2 text-weight-bold">Billed（Total）</span>
      <div class="row justify-between items-end">
        <strong class="text-h4 text-weight-bold">{{
          totalCoinFormated
        }}</strong>
        <q-btn
          outline
          unelevated
          size="sm"
          rounded
          class="q-mb-sm text-normal text-weight-bold"
          >Pay total</q-btn
        >
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  item: number | string | undefined
}>()

const totalCoinFormated = computed(() => {
  return props.item?.toLocaleString()
})
</script>
