<template>
  <q-card class="notification-register-card">
    <q-card-section>
      <q-section-header
        title="Notificaiton"
        sub-title="Member Account Registration"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <span class="bg-grey-1 rounded-borders block full-width q-pa-md">
        {{ item?.contentFormated?.registerContent }}
      </span>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ActionProp } from 'src/core/types/action-prop-types'
import { UserNotification } from 'src/core/types/use-notification-types'

// props & emits
const emits = defineEmits(['close', 'delete'])
const props = defineProps<{
  item: UserNotification | undefined
}>()
// composables
const { t } = useI18n()

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      class: 'bg-grey-1',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      color: 'primary',
      unelevated: true,
      name: t('textActions.Delete'),
      action: onDelete,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

function onDelete() {
  emits('delete')
  emits('close')
}
</script>
<style lang="scss">
.notification-register-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
