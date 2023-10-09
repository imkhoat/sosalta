<template>
  <div class="q-code">
    <q-btn
      unelevated
      size="sm"
      class="q-code__copy q-pa-sm"
      icon="r_copy_all"
      @click="onCopySource"
    ></q-btn>
    <code>
      <slot></slot>
    </code>
  </div>
</template>
<script lang="ts" setup>
import { copyToClipboard, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const $q = useQuasar()
const { t } = useI18n()

const props = defineProps<{
  code: string
}>()

// methods
function onCopySource() {
  copyToClipboard(props.code)
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
<style lang="scss" scoped>
.q-code {
  padding: map-get($map: $space-xs, $key: 'y') $space-base;
  font-size: $input-font-size;
  background-color: $grey-4;
  border-radius: $generic-border-radius;
  font-style: italic;
  position: relative;

  &__copy {
    position: absolute;
    right: map-get($map: $space-xs, $key: 'y');
    top: map-get($map: $space-xs, $key: 'y');
  }
}
</style>
