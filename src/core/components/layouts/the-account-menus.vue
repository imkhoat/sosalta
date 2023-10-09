<template>
  <q-btn
    size="sm"
    rounded
    round
    flat
  >
    <q-icon
      size="22px"
      name="sym_o_account_circle"
    ></q-icon>
    <q-tooltip>Account</q-tooltip>
    <q-menu class="menus-context">
      <q-card flat>
        <q-card-section class="q-pb-none">
          <user-logout :action-hidden="true"></user-logout>
        </q-card-section>
      </q-card>
      <q-separator></q-separator>
      <q-list>
        <template
          v-for="(group, index) in menus"
          :key="index + '_menus-context-group'"
        >
          <q-item-label
            header
            class="text-caption"
            >{{ group.group }}</q-item-label
          >
          <q-item
            v-for="(menu, menuIndex) in group.menus"
            clickable
            class="row justify-start"
            :class="menu?.class"
            :key="menuIndex + '_menus-context-menu'"
            :disable="menu.disabled"
            @click="menu.action"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
                :class="menu.iconClass"
              >
                <q-avatar
                  size="xs"
                  color="grey-3"
                  text-color="primary-4"
                  class="q-pa-xs q-box-content"
                >
                  <q-icon
                    size="xs"
                    :name="menu.icon"
                    class="material-icons-round"
                  ></q-icon>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none">{{
              menu.name
            }}</q-item-section>
          </q-item>
          <q-separator></q-separator>
        </template>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/core/stores/auth'
import { AUTH_ROUTE_NAMES } from 'src/pages/auth/router'
import UserLogout from 'src/core/components/molecules/user-logout.vue'
import { ACCOUNT_SETTING_ROUTE_NAMES } from 'src/pages/account-setting/router'
import { IMPORT_PROGRESS_ROUTE_NAMES } from 'src/pages/import-progress/router'
import { OPERATION_LOGGING_ROUTE_NAMES } from 'src/pages/operation-logging/router'

const router = useRouter()
const { logout } = useAuthStore()
const menus: {
  group: string
  menus: {
    name: string
    icon: string
    disabled?: boolean
    class?: string
    iconClass?: string
    action: () => void
  }[]
}[] = [
  {
    group: 'Account',
    menus: [
      {
        name: 'Account information',
        icon: 'sym_o_account_box',
        disabled: false,
        action: onAccessAccountSetting,
      },
      {
        name: 'Security Setting',
        icon: 'sym_o_verified_user',
        disabled: false,
        action: onAccessSecuritySetting,
      },
    ],
  },
  {
    group: 'Notification',
    menus: [
      {
        name: 'Unread messages',
        icon: 'sym_o_mark_chat_unread',
        disabled: true,
        action: onAccessAccountSetting,
      },
      {
        name: 'Operation logs',
        icon: 'sym_o_web_stories',
        disabled: false,
        action: onAccessOperationLogging,
      },
      {
        name: 'Importing progress',
        icon: 'sym_o_system_update_alt',
        action: onAccessImportingProgress,
      },
    ],
  },
  {
    group: 'Payment & Subscription',
    menus: [
      {
        name: 'Payment history',
        icon: 'sym_o_credit_card',
        disabled: true,
        action: onAccessAccountSetting,
      },
      {
        name: 'My coupon',
        icon: 'sym_o_sell',
        disabled: true,
        action: onAccessAccountSetting,
      },
      {
        name: 'My subscription',
        icon: 'sym_o_subscriptions',
        disabled: true,
        action: onAccessAccountSetting,
      },
    ],
  },
  {
    group: 'Developer',
    menus: [
      {
        name: 'Developer center',
        icon: 'sym_o_developer_board',
        disabled: true,
        action: onAccessAccountSetting,
      },
    ],
  },
  {
    group: '',
    menus: [
      {
        name: 'Logout',
        icon: 'sym_o_logout',
        class: 'text-negative',
        iconClass: 'text-negative bg-red-1',
        disabled: false,
        action: onLogout,
      },
    ],
  },
]

// methods
function onAccessAccountSetting() {
  router.push({
    name: ACCOUNT_SETTING_ROUTE_NAMES.ENTRIES,
    query: { tab: 'account-information' },
  })
}
function onAccessSecuritySetting() {
  router.push({
    name: ACCOUNT_SETTING_ROUTE_NAMES.ENTRIES,
    query: { tab: 'security-setting' },
  })
}
function onAccessImportingProgress() {
  router.push({
    name: IMPORT_PROGRESS_ROUTE_NAMES.ENTRIES,
  })
}
function onAccessOperationLogging() {
  router.push({
    name: OPERATION_LOGGING_ROUTE_NAMES.ENTRIES,
  })
}
function onLogout() {
  logout()
  router.push({ name: AUTH_ROUTE_NAMES.LOGIN })
}
</script>
