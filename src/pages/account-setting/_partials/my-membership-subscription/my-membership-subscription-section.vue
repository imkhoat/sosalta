<template>
  <q-card class="bg-grey-1 no-box-shadow rounded-borders">
    <q-card-section>
      <q-card class="bg-grey-2 no-box-shadow rounded-borders">
        <q-card-section class="row">
          <q-avatar
            color="green-1"
            text-color="positive"
            icon="r_diamond"
          ></q-avatar>
          <div class="col q-pl-sm">
            <div
              class="text-weight-bolder justify-between no-wrap items-center"
            >
              {{ subscriptionLevel }}
              <q-btn
                v-if="!isMobileScreen"
                flat
                color="info"
                size="md"
                class="text-no-wrap"
                icon-right="navigate_next"
                @click="onViewDetail"
                >{{ $t('textActions.View detail') }}</q-btn
              >
            </div>
            <div class="text-disable row justify-between items-center">
              {{ expireOn }}
              <q-btn
                v-if="isMobileScreen"
                flat
                color="info"
                size="md"
                class="text-no-wrap q-px-xs self-end"
                icon-right="navigate_next"
                @click="onViewDetail"
                >{{ $t('textActions.View detail') }}</q-btn
              >
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section>
      <q-form-actions
        v-model="expanded"
        :inline="!isMobileScreen"
        :dialog="isMobileScreen"
        :actions="formActions"
      ></q-form-actions>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDateFormat } from '@vueuse/core'
import { ActionProp } from 'src/core/types/action-prop-types'

import { MEMBER_CENTER_ROUTE_NAMES } from 'src/core/router/routes'
import { useMemberCenterStore } from 'src/core/stores/member-center'

// composables
const $q = useQuasar()
const { t } = useI18n()
const router = useRouter()
const { getUserSubscription } = useMemberCenterStore()

const expanded = ref(true)

const subscriptionLevel = computed(() => {
  return t(
    'pages.account.membershipSubscription.Membership Subscription Level',
    { level: getUserSubscription?.typeNote }
  )
})

const expireOn = computed(() => {
  const date = useDateFormat(
    new Date(getUserSubscription?.expireTime),
    'DD-MM-YYYY HH:MM'
  )
  return t('pages.account.membershipSubscription.Expires On', {
    date: date.value,
  })
})

const isMobileScreen = computed(() => {
  return $q.screen.lt.sm
})

const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Downgrade'),
      action: onDowngradeSubscription,
    },
    {
      color: 'primary',
      unelevated: true,
      name: t('textActions.Upgrade'),
      action: onUpgradeSubscription,
    },
  ]
})

// methods
function onDowngradeSubscription() {
  console.log('')
}
function onUpgradeSubscription() {
  console.log('')
}

function onViewDetail() {
  router.push({ name: MEMBER_CENTER_ROUTE_NAMES.MEMBERSHIP })
}
</script>
<style lang="scss">
.password-section {
  .q-expansion-item__container .q-item__section {
    display: none;
  }
}
</style>
