<template>
  <div
    class="entries-page window-width window-height column justify-center items-center bg-grey-1 q-px-sm"
  >
    <q-card
      flat
      bordered
      class="support-page__card rounded-borders"
    >
      <q-card-section>
        <brand-logo></brand-logo>
        <q-section-header
          title="We here to help"
          sub-title="We are always ready to listen to improve AtlasOS, contact us at"
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-list
          bordered
          separator
          class="rounded-borders"
        >
          <q-item
            clickable
            v-ripple
          >
            <q-item-section avatar>
              <q-icon name="sym_o_mail"></q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Email</q-item-label>
              <q-item-label>{{ email }}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-btn
                flat
                round
                rounded
                size="sm"
                class="text-normal text-primary"
                @click="onCopySource"
              >
                <q-icon name="sym_o_content_copy"></q-icon>
                <q-tooltip max-width="480px"> Copy URL </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions
        align="right"
        class="q-px-md q-pb-md"
      >
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar, copyToClipboard } from 'quasar'
import BrandLogo from 'components/molecules/brand-logo.vue'
import { ActionProp } from 'src/core/types/action-prop-types'
import { FILE_SYSTEM_ROUTE_NAMES } from 'src/pages/file-system/router'

// composables
const router = useRouter()
const { t } = useI18n()
const $q = useQuasar()

// computed
const email = 'support@atlas-os.org'
const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      class: 'bg-grey-1',
      action: onBack,
    },
    {
      color: 'primary',
      unelevated: true,
      target: '_blank',
      name: t('textActions.Email us'),
      href: `mailto:${email}`,
    },
  ]
})

// methods
function onBack() {
  router.push({ name: FILE_SYSTEM_ROUTE_NAMES.ENTRIES })
}

function onCopySource() {
  if (!email) {
    $q.notify({
      message: t('general.Copy fail'),
      type: 'negative',
    })
    return
  }
  copyToClipboard(email)
    .then(() => {
      $q.notify({
        message: t('general.Copy success'),
        type: 'positive',
      })
    })
    .catch(() => {
      $q.notify({
        message: t('general.Copy fail'),
        type: 'negative',
      })
    })
}
</script>
<style lang="scss">
.support-page__card {
  max-width: 480px;
}
</style>
