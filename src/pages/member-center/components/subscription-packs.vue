<template>
  <q-card class="subscription-packs">
    <q-card-section class="row items-stretch">
      <div
        class="col-12 col-md-6 col-lg-4 col-xl-4 q-pa-xs"
        v-for="(pack, index) in packs"
        :key="index + '_subscription-pack__item'"
      >
        <subscription-pack-item
          class="subscription-packs__item-card full-height"
          :item="pack"
          :item-selected="pack.id === selectedPack?.id"
          @select="onSelectPack(pack)"
        ></subscription-pack-item>
      </div>
    </q-card-section>
    <q-card-section class="q-pa-lg">
      <q-form-actions
        v-model="selected"
        :inline="!isMobileScreen"
        :dialog="isMobileScreen"
        :actions="formActions"
      ></q-form-actions>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { Subscription, SubscriptionPack } from 'src/core/types/subscription'
import SubscriptionPackItem from 'src/pages/member-center/components/subscription-pack-item.vue'
import { ActionProp } from 'src/core/types/action-prop-types'

import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

// composable
const $q = useQuasar()
const { t } = useI18n()
// props & emits
defineProps<{
  subscription?: Subscription
  packs?: SubscriptionPack[]
}>()

const emits = defineEmits(['close', 'checkout'])
// data
const loading = ref(false)
const selected = ref(false)
const selectedPack = ref<SubscriptionPack>()
// computed
const isMobileScreen = computed(() => {
  return $q.screen.lt.sm
})

const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onToggleMode,
    },
    {
      color: 'primary',
      unelevated: true,
      name: t('textActions.Get this pack'),
      action: onGetThisPack,
      loading: loading.value,
    },
  ]
})

// methods
function onToggleMode() {
  emits('close')
}
function onSelectPack(pack: SubscriptionPack) {
  selected.value = true
  selectedPack.value = pack
}
function onGetThisPack() {
  emits('checkout', selectedPack.value)
}
</script>
<style lang="scss">
.subscription-packs {
  &__item-card:hover {
    cursor: pointer;
    border-color: $primary;
    background-color: $grey-1;
  }
}
</style>
