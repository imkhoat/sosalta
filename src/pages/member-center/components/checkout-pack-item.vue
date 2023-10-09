<template>
  <q-card
    flat
    class="chekout-pack-item no-box-shadow bg-grey-1"
  >
    <q-card-section
      class="chekout-pack-item__title row no-wrap justify-between items-start"
    >
      <strong>{{ subscriptionName }}</strong>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
defineProps<{
  subscriptionName?: string
  expiredDate?: string
}>()

// computed
</script>
<style lang="scss">
.chekout-pack-item {
  &__title-selector {
    margin-top: -8px;
  }
}
</style>
