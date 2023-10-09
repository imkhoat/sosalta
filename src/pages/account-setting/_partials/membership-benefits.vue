<template>
  <page-wrapper
    icon="r_featured_play_list"
    :title="$t('pages.account.membershipBenefits.Membership benefits')"
    :sub-title="
      $t(
        'pages.account.membershipBenefits.Enjoy the features of your membership tier'
      )
    "
    v-model="isEditing"
  >
    <div class="security-setting__form">
      <div class="security-setting__block">
        <membership-benefits-section></membership-benefits-section>
      </div>
    </div>
  </page-wrapper>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import PageWrapper from 'src/core/components/molecules/page-wrapper.vue'
import MembershipBenefitsSection from './membership-benefits/membership-benefits-section.vue'

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
