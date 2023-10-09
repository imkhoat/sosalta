<template>
  <q-select
    v-model="locale"
    :options="localeOptions"
    :label="$t('general.Language')"
    dense
    borderless
    emit-value
    map-options
    hide-hint
    hide-dropdown-icon
    options-dense
    class="change-locale"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n({ useScope: 'global' })
const localeOptions = computed(() => {
  return [
    { value: 'en-US', label: t('general.English') },
    { value: 'zh-CN', label: t('general.Chinese') },
  ]
})
</script>
<style>
.change-locale {
  min-width: 60px;
}
</style>
