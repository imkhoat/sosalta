<template>
  <q-card class="subscription-feature-title no-box-shadow">
    <q-card-section class="subscription-feature-title__title"></q-card-section>
    <q-card-section class="subscription-feature-title__body">
      <div class="row subscription-feature-title__group">
        <div class="col-12 text-disable text-caption">Subscription pricing</div>
      </div>
      <div class="row subscription-feature-title__item">
        <div class="col-12 subscription-feature-title__item-text gt-sm">
          {{
            $t('pages.memberCenter.subscription.Subscription Annually Price')
          }}
        </div>
      </div>
      <div class="row subscription-feature-title__item">
        <div class="col-12 subscription-feature-title__item-text gt-sm">
          {{ $t('pages.memberCenter.subscription.Subscription Month Price') }}
        </div>
      </div>
      <div class="row subscription-feature-title__group">
        <div class="col-12 text-disable text-caption">Analysis Apps</div>
      </div>
      <div class="row subscription-feature-title__item">
        <div class="col-12 subscription-feature-title__item-text gt-sm">
          {{ $t('pages.memberCenter.subscription.Max Analysis Apps Number') }}
        </div>
      </div>
      <div class="row subscription-feature-title__group">
        <div class="col-12 text-disable text-caption">Clouds PC</div>
      </div>
      <div class="row subscription-feature-title__item">
        <div class="col-12 subscription-feature-title__item-text gt-sm">
          {{ $t('pages.memberCenter.subscription.Max Cloudpc Hourly Charge') }}
        </div>
      </div>
      <div class="row subscription-feature-title__item">
        <div class="col-12 subscription-feature-title__item-text gt-sm">
          {{ $t('pages.memberCenter.subscription.Max Cloudpcs Number') }}
        </div>
      </div>
      <div class="row subscription-feature-title__item">
        <div class="col-12 subscription-feature-title__item-text gt-sm">
          {{ $t('pages.memberCenter.subscription.Hard Disk Size') }}
        </div>
      </div>
      <div class="row subscription-feature-title__group">
        <div class="col-12 text-disable text-caption">File system & Member</div>
      </div>
      <div class="row subscription-feature-title__item">
        <div class="col-12 subscription-feature-title__item-text gt-sm">
          {{ $t('pages.memberCenter.subscription.Max Storage Capacity') }}
        </div>
      </div>
      <div class="row subscription-feature-title__item">
        <div class="col-12 subscription-feature-title__item-text gt-sm">
          {{ $t('pages.memberCenter.subscription.Max Member Account Number') }}
        </div>
      </div>
      <div class="row subscription-feature-title__group">
        <div class="col-12 text-disable text-caption">Fees & Support</div>
      </div>
      <div class="row subscription-feature-title__item">
        <div class="col-12 subscription-feature-title__item-text gt-sm">
          {{ $t('pages.memberCenter.subscription.Service Charge') }}
        </div>
      </div>
      <div class="row subscription-feature-title__item">
        <div class="col-12 subscription-feature-title__item-text gt-sm">
          {{ $t('pages.memberCenter.subscription.Max Allowed Unpaid Fee') }}
        </div>
      </div>
      <div class="row subscription-feature-title__item">
        <div class="col-12 subscription-feature-title__item-text gt-sm">
          {{ $t('pages.memberCenter.subscription.Support') }}
        </div>
      </div>
    </q-card-section>
    <q-card-section class="subscription-feature-title__action"></q-card-section>
  </q-card>
</template>
<style lang="scss">
.subscription-feature-title {
  border: 6px solid transparent;
  outline: 8px solid transparent;
  &__title {
    height: 200px;
  }

  &__action {
    height: 150px;
  }
  &__item {
    height: 44px !important;
    border-bottom: 1px solid $grey-1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  &__group {
    height: 42px !important;
    margin-top: 20px;
  }
  &__item-text {
    font-weight: 600;
  }
  &__value {
    max-height: 50px !important;
    min-height: 50px !important;
    text-align: right;
    font-size: $body-font-size;
    font-weight: bold;
    @media (min-width: $breakpoint-md-min) {
      text-align: center;
    }
  }
}
</style>
