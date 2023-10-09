<template>
  <div class="page-wrapper">
    <div class="page-wrapper__header">
      <div class="page-wrapper__title">
        <q-avatar
          size="xl"
          color="grey-3"
          class="icon"
          :icon="icon"
        ></q-avatar>
        <div class="page-wrapper__title-content">
          <strong class="title">{{ title }}</strong>
          <p class="subtitle">{{ subTitle }}</p>
        </div>
      </div>
      <div class="page-wrapper__actions">
        <slot name="header-action" />
      </div>
    </div>
    <div class="page-wrapper__body">
      <slot />
    </div>
    <q-dialog
      v-model="dialog"
      seamless
      position="bottom"
      class="page-wrapper__footer"
    >
      <q-card class="window-width">
        <q-card-section class="row items-center no-wrap">
          <slot name="footer-action" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

// props
const props = defineProps<{
  icon?: string
  title?: string
  subTitle?: string
  modelValue: boolean
}>()

const emits = defineEmits(['update:modelValue'])

// computed
const dialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})
</script>
<style lang="scss" scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    padding-bottom: map-get($map: $space-lg, $key: 'y');
    border-bottom: 1px solid $grey-4;
  }

  &__title {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: $flex-gutter-sm;
  }
  &__title-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  &__title .title {
    font-size: 24px;
    font-weight: bold;
    line-height: 24px;
  }

  &__title .subtitle {
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
    opacity: 0.6;
    margin-bottom: 0;
  }
}
</style>
