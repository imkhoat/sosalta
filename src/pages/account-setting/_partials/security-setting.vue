<template>
  <page-wrapper
    icon="r_verified_user"
    :title="$t('pages.account.securitySetting.Security setting')"
    :sub-title="
      $t('pages.account.securitySetting.Protect your account against risks')
    "
    v-model="isEditing"
  >
    <div class="security-setting__form">
      <div class="security-setting__block">
        <password-section></password-section>
      </div>
      <div class="security-setting__block">
        <phone-section></phone-section>
      </div>
      <div class="security-setting__block">
        <email-section></email-section>
      </div>
    </div>
  </page-wrapper>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import PageWrapper from 'src/core/components/molecules/page-wrapper.vue'
import PasswordSection from './security-setting/password-section.vue'
import PhoneSection from './security-setting/phone-section.vue'
import EmailSection from './security-setting/email-section.vue'

// data
const isEditing = ref(false)
</script>
<style lang="scss">
.security-setting {
  gap: 24px;

  &__form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 24px;
    margin-top: map-get($map: $space-xl, $key: 'y');
    margin-bottom: (map-get($map: $space-xl, $key: 'y') * 2);
  }

  &__block {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  &__block .block-form row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>
