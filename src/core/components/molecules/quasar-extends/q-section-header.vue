<template>
  <div
    class="section-header"
    :class="{ 'section-header--center': center }"
  >
    <strong
      class="section-header__title"
      :class="titleClass"
    >
      {{ title }}
      <q-badge
        v-if="badge"
        :color="badgeColor"
        align="middle"
        >{{ badge }}</q-badge
      >
    </strong>
    <span
      v-if="subTitle"
      class="section-header__subtitle ellipsis full-width text-no-wrap"
      >{{ subTitle }}</span
    >
    <span
      v-if="subTitleHtml"
      class="section-header__subtitle ellipsis full-width text-no-wrap"
      v-html="subTitleHtml"
    ></span>
  </div>
</template>
<script lang="ts" setup>
//props
defineProps<{
  center?: boolean
  title?: string
  titleClass?: string
  subTitle?: string
  subTitleHtml?: string
  badge?: string
  badgeColor?:
    | 'success'
    | 'primary'
    | 'info'
    | 'warning'
    | 'positive'
    | 'negative'
    | 'error'
}>()
</script>
<style lang="scss" scoped>
.section-header {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  &--center {
    justify-content: center;
    align-items: center;
  }

  &__title {
    font-size: 18px;
    font-weight: bold;
  }

  &__subtitle {
    font-size: 13px;
    font-weight: medium;
    opacity: 0.6;
    white-space: pre-wrap;
  }
}
</style>
