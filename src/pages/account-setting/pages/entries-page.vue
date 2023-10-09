<template>
  <q-card
    flat
    class="account-setting-page__card rounded-lg rounded-borders q-pa-xs q-pa-md-lg"
  >
    <div class="row">
      <div class="col-12 col-md-3">
        <q-tabs
          v-model="activeTab"
          :vertical="!isMobile"
          :mobile-arrows="false"
        >
          <q-route-tab
            v-for="(tab, tabIndex) in visibleTabs"
            :key="tabIndex + '_account-setting-tab'"
            :name="tab.name"
            :label="tab.title"
            class="account-setting-page__tab"
            active-class="bg-grey-1"
            content-class="account-setting-page__tab-content text-capitalize"
            :to="{
              name: ACCOUNT_SETTING_ROUTE_NAMES.ENTRIES,
              query: { tab: tab.name },
            }"
          />
        </q-tabs>
      </div>
      <div class="col-12 col-md-9 scroll overflow-auto">
        <q-tab-panels
          v-model="activeTab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel
            v-for="(tab, tabIndex) in visibleTabs"
            :key="tabIndex + '_account-setting-tab-panel'"
            :name="tab.name"
          >
            <component :is="tab.component"></component>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, shallowRef } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/core/stores/auth'
import AccountInformation from 'src/pages/account-setting/components/account-information.vue'
import SecuritySetting from 'src/pages/account-setting/components/security-setting.vue'
import PermissionsSetting from 'src/pages/account-setting/components/permissions-setting.vue'
import ServiceCharge from 'src/pages/account-setting/components/service-charge.vue'
import StorageUsage from 'src/pages/account-setting/components/storage-usage.vue'
import MyMembershipSubscription from 'src/pages/account-setting/components/my-membership-subscription.vue'
import MembershipBenefits from 'src/pages/account-setting/components/membership-benefits.vue'
import OthersSetting from 'src/pages/account-setting/components/others-setting.vue'
import { ACCOUNT_SETTING_ROUTE_NAMES } from 'src/pages/account-setting/router/index'
import { httpsGetMemberCenterOrderRecord } from 'src/core/services/member-center-services'

const ACCOUNT_SETTING_TAB = {
  ACCOUNT_INFORMATION: 'account-information',
  SECURITY_SETTING: 'security-setting',
  PERMISSIONS: 'permissions',
  SERVICE_CHARGE: 'service-charge',
  STORAGE_USAGE: 'storage-usage',
  MY_MEMBERSHIP_SUBSCRIPTION: 'my-membership-subscription',
  MEMBERSHIP_BENEFITS: 'membership-benefits',
  OTHERS: 'others',
}

// composables
const $q = useQuasar()
const { getUserAuthorization } = useAuthStore()
const accountSettingPageMenus = computed(() => {
  return getUserAuthorization?.accountSettingPage?.menus
})
// data
const tabs = shallowRef([
  {
    name: ACCOUNT_SETTING_TAB.ACCOUNT_INFORMATION,
    title: 'Account information',
    to: 'account-information',
    component: AccountInformation,
    visible: accountSettingPageMenus.value?.accountInformation?.visible,
  },
  {
    name: ACCOUNT_SETTING_TAB.SECURITY_SETTING,
    title: 'Security setting',
    to: 'security-setting',
    component: SecuritySetting,
    visible: accountSettingPageMenus.value?.securitySetting?.visible,
  },
  {
    name: ACCOUNT_SETTING_TAB.PERMISSIONS,
    title: 'Permission',
    to: 'permission',
    component: PermissionsSetting,
    visible: accountSettingPageMenus.value?.permissions?.visible,
  },
  {
    name: ACCOUNT_SETTING_TAB.SERVICE_CHARGE,
    title: 'Atlas OS Service Charge',
    to: 'service-charge',
    component: ServiceCharge,
    visible: accountSettingPageMenus.value?.serviceCharge?.visible,
  },
  {
    name: ACCOUNT_SETTING_TAB.STORAGE_USAGE,
    title: 'Storage Usage',
    to: 'storage-usage',
    component: StorageUsage,
    visible: accountSettingPageMenus.value?.storageUsage?.visible,
  },
  {
    name: ACCOUNT_SETTING_TAB.MY_MEMBERSHIP_SUBSCRIPTION,
    title: 'My Membership Subscription',
    to: 'my-membership-subscription',
    component: MyMembershipSubscription,
    visible: accountSettingPageMenus.value?.myMembershipSubscription?.visible,
  },
  {
    name: ACCOUNT_SETTING_TAB.MEMBERSHIP_BENEFITS,
    title: 'Membership Benefits',
    to: 'membership-benefits',
    component: MembershipBenefits,
    visible: accountSettingPageMenus.value?.membershipBenefits?.visible,
  },
  {
    name: ACCOUNT_SETTING_TAB.OTHERS,
    title: 'Others',
    to: 'others',
    component: OthersSetting,
    visible: accountSettingPageMenus.value?.othersSetting?.visible,
  },
])

const activeTab = ref(ACCOUNT_SETTING_TAB.ACCOUNT_INFORMATION)

// computed
const isMobile = computed(() => {
  return $q.screen.lt.md
})

const visibleTabs = computed(() => {
  return tabs.value.filter((tab) => {
    return tab.visible
  })
})

// hook
onMounted(async () => {
  await httpsGetMemberCenterOrderRecord()
})
</script>
<style lang="scss">
.account-setting-page {
  &__tab {
    justify-content: flex-start;
  }

  &__tab-content {
    text-align: left;
    align-items: flex-start !important;
  }
}
</style>
