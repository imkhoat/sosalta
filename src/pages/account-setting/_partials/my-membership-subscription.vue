<template>
  <page-wrapper
    icon="r_loyalty"
    :title="$t('pages.account.membershipSubscription.Subscription')"
    :sub-title="
      $t(
        'pages.account.membershipSubscription.Membership information and subscription packages'
      )
    "
    v-model="isEditing"
  >
    <div class="my-membership-subscription__form">
      <div class="my-membership-subscription__block">
        <my-membership-subscription-section></my-membership-subscription-section>
      </div>
    </div>
  </page-wrapper>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import PageWrapper from 'src/core/components/molecules/page-wrapper.vue'
import MyMembershipSubscriptionSection from './my-membership-subscription/my-membership-subscription-section.vue'

// data
const isEditing = ref(false)
</script>
<style lang="scss">
.my-membership-subscription {
  gap: 24px;

  &__form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 24px;
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
