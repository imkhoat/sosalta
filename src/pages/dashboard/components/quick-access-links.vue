<template>
  <q-card
    flat
    class="quick-access-links"
  >
    <q-card-section>
      <q-scroll-area
        style="height: 480px"
        :thumb-style="{ width: '4px' }"
      >
        <q-list dense>
          <template
            v-for="(item, index) in menus"
            :key="index"
          >
            <q-item
              v-if="!item.children"
              v-ripple
              clickable
              :disable="!item.visible"
              :active="item.to?.name === activeMenu"
              :to="item.to"
              class="rounded-borders"
              active-class="bg-grey-1"
            >
              <q-item-section avatar>
                <q-avatar
                  size="md"
                  color="grey-1"
                  text-color="primary"
                >
                  <q-avatar
                    size="xs"
                    color="grey-3"
                    text-color="primary-4"
                    class="q-pa-xs q-box-content"
                  >
                    <q-icon
                      size="sm"
                      :name="item.icon"
                    />
                  </q-avatar>
                </q-avatar>
              </q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
              <q-item-section
                v-if="!item.children"
                avatar
              >
                <q-icon
                  size="xs"
                  name="sym_o_ungroup"
                />
              </q-item-section>
            </q-item>
            <template v-if="item.children">
              <q-item
                v-ripple
                clickable
                :active="item.to?.name === activeMenu"
                class="rounded-borders text-disable"
                active-class="bg-grey-1"
              >
                <q-item-section avatar>
                  <q-avatar
                    size="md"
                    color="grey-1"
                    text-color="primary"
                  >
                    <q-avatar
                      size="xs"
                      color="grey-3"
                      text-color="primary-4"
                      class="q-pa-xs q-box-content"
                    >
                      <q-icon
                        size="sm"
                        :name="item.icon"
                      />
                    </q-avatar>
                  </q-avatar>
                </q-item-section>
                <q-item-section>{{ item.label }}</q-item-section>
              </q-item>
              <q-list dense>
                <template
                  v-for="(subItem, indexSubItem) in item.children"
                  :key="indexSubItem"
                >
                  <q-item
                    v-ripple
                    clickable
                    :disable="!subItem.visible"
                    :active="subItem.to?.name === activeMenu"
                    :to="subItem.to"
                    class="rounded-borders"
                    active-class="bg-grey-1"
                  >
                    <q-item-section avatar>
                      <q-icon
                        size="sm"
                        :name="subItem.icon"
                        :color="
                          subItem.to?.name === activeMenu ? 'primary' : 'accent'
                        "
                      />
                    </q-item-section>
                    <q-item-section>{{ subItem.label }}</q-item-section>
                    <q-item-section avatar>
                      <q-icon
                        size="xs"
                        name="sym_o_ungroup"
                      />
                    </q-item-section>
                  </q-item>
                </template>
              </q-list>
            </template>
            <q-separator
              spaced
              inset
            />
          </template>
        </q-list>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { MENU_ICON } from 'src/core/types/menu-icon-types'
import { Menu } from 'src/core/types/menu-types'
import { computed } from 'vue'
import {
  FILE_SYSTEM_ROUTE_NAMES,
  KEY_MANAGER_ROUTE_NAMES,
  ACCOUNT_SETTING_ROUTE_NAMES,
  MEMBER_USERS_ROUTE_NAMES,
  TEAM_MANAGEMENT_ROUTE_NAMES,
  PROJECT_MANAGEMENT_ROUTE_NAMES,
  CLOUD_PC_ROUTE_NAMES,
  RECYCLE_BIN_ROUTE_NAMES,
} from 'src/core/router/routes'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { useRoute } from 'vue-router'

// composables
const route = useRoute()
const { getUserAuthorization } = storeToRefs(useAuthStore())

const activeMenu = computed(() => {
  return route.name
})
const menus = computed((): Menu[] => {
  return [
    {
      icon: MENU_ICON.FILE_SYSTEM,
      label: 'File System',
      separator: true,
      to: { name: FILE_SYSTEM_ROUTE_NAMES.ENTRIES },
      visible: getUserAuthorization.value.fileSystemPage.menus.entries?.visible,
      readonly:
        getUserAuthorization.value.fileSystemPage.menus.entries?.readonly,
    },
    {
      icon: MENU_ICON.KEY_MANAGER,
      label: 'Key Manager',
      separator: true,
      to: { name: KEY_MANAGER_ROUTE_NAMES.ENTRIES },
      visible: getUserAuthorization.value.keyManagerPage.menus.entries?.visible,
      readonly:
        getUserAuthorization.value.keyManagerPage.menus.entries?.readonly,
    },
    {
      icon: MENU_ICON.CLOUD_PC,
      label: 'Cloud PC',
      separator: false,
      to: { name: CLOUD_PC_ROUTE_NAMES.ENTRIES },
      visible: getUserAuthorization.value.cloudPCPage.menus.entries?.visible,
      readonly: getUserAuthorization.value.cloudPCPage.menus.entries?.readonly,
      children: [
        {
          label: 'Data Drive',
          separator: false,
          to: { name: CLOUD_PC_ROUTE_NAMES.DATA_DRIVE },
          visible:
            getUserAuthorization.value.cloudPCPage.menus.dataDrive?.visible,
          readonly:
            getUserAuthorization.value.cloudPCPage.menus.dataDrive?.readonly,
        },
        {
          label: 'Machine Images',
          separator: false,
          to: { name: CLOUD_PC_ROUTE_NAMES.MACHINE_IMAGE },
          visible:
            getUserAuthorization.value.cloudPCPage.menus.machinePublicImage
              ?.visible ||
            getUserAuthorization.value.cloudPCPage.menus.machinePrivateImage
              ?.visible,
          readonly:
            getUserAuthorization.value.cloudPCPage.menus.entries?.readonly ||
            getUserAuthorization.value.cloudPCPage.menus.machinePrivateImage
              ?.readonly,
        },
        {
          label: 'Cloud PC',
          separator: false,
          to: { name: CLOUD_PC_ROUTE_NAMES.MACHINE_INSTANCES },
          visible:
            getUserAuthorization.value.cloudPCPage.menus.cloudPC?.visible,
          readonly:
            getUserAuthorization.value.cloudPCPage.menus.cloudPC?.readonly,
        },
      ],
    },
    {
      icon: MENU_ICON.MEMBER_USER,
      label: 'Member User',
      separator: true,
      to: { name: MEMBER_USERS_ROUTE_NAMES.ENTRIES },
      visible: getUserAuthorization.value.memberUserPage.menus.entries?.visible,
      readonly:
        getUserAuthorization.value.memberUserPage.menus.entries?.readonly,
      children: [
        {
          label: 'Member Settings',
          separator: false,
          to: { name: MEMBER_USERS_ROUTE_NAMES.MEMBER_SETTINGS },
          visible:
            getUserAuthorization.value.memberUserPage.menus.memberSettings
              ?.visible,
          readonly:
            getUserAuthorization.value.memberUserPage.menus.memberSettings
              ?.readonly,
        },
        {
          label: 'Member Files',
          separator: false,
          to: { name: MEMBER_USERS_ROUTE_NAMES.MEMBER_FILES },
          visible:
            getUserAuthorization.value.memberUserPage.menus.memberFiles
              ?.visible,
          readonly:
            getUserAuthorization.value.memberUserPage.menus.memberFiles
              ?.readonly,
        },
      ],
    },
    {
      icon: MENU_ICON.PROJECT,
      label: 'Project',
      separator: false,
      to: { name: PROJECT_MANAGEMENT_ROUTE_NAMES.ENTRIES },
      visible: getUserAuthorization.value.projectPage.menus.entries?.visible,
      readonly: getUserAuthorization.value.projectPage.menus.entries?.readonly,
    },
    {
      icon: MENU_ICON.TEAM,
      label: 'Team',
      separator: false,
      to: { name: TEAM_MANAGEMENT_ROUTE_NAMES.ENTRIES },
      visible: getUserAuthorization.value.teamPage.menus.entries?.visible,
      readonly: getUserAuthorization.value.teamPage.menus.entries?.readonly,
    },
    {
      icon: MENU_ICON.CLOUD_APP,
      label: 'Cloud App',
      separator: false,
      to: { name: 'cloud-app', path: '/cloud-app' },
      visible: getUserAuthorization.value.cloudAppPage.menus.entries?.visible,
      readonly: getUserAuthorization.value.cloudAppPage.menus.entries?.readonly,
      children: [
        {
          label: 'Run Apps',
          separator: false,
          to: { name: 'cloud-app-run' },
          visible:
            getUserAuthorization.value.cloudAppPage.menus.runApps?.visible,
          readonly:
            getUserAuthorization.value.cloudAppPage.menus.runApps?.readonly,
        },
        {
          label: 'Results',
          separator: false,
          to: { name: 'cloud-app-result' },
          visible:
            getUserAuthorization.value.cloudAppPage.menus.results?.visible,
          readonly:
            getUserAuthorization.value.cloudAppPage.menus.results?.readonly,
        },
      ],
    },
    {
      icon: MENU_ICON.ACCOUNT_SETTING,
      label: 'Account Settings',
      separator: false,
      to: {
        name: ACCOUNT_SETTING_ROUTE_NAMES.ENTRIES,
        query: { tab: 'account-information' },
      },
      visible:
        getUserAuthorization.value.accountSettingPage.menus.entries?.visible,
      readonly:
        getUserAuthorization.value.accountSettingPage.menus.entries?.readonly,
    },
    {
      icon: MENU_ICON.PAYMENT,
      label: 'Payment',
      separator: false,
      to: { name: 'payment', path: '/payment' },
      visible: getUserAuthorization.value.paymentPage.menus.entries?.visible,
      readonly: getUserAuthorization.value.paymentPage.menus.entries?.readonly,
      children: [
        {
          label: 'Payment Details',
          separator: false,
          to: { name: 'payment-detail', path: '/payment-detail' },
          visible:
            getUserAuthorization.value.fileSystemPage.menus.entries?.visible,
          readonly:
            getUserAuthorization.value.fileSystemPage.menus.entries?.readonly,
        },
        {
          label: 'Payment History',
          separator: false,
          to: { name: 'payment-history', path: '/payment-history' },
          visible:
            getUserAuthorization.value.fileSystemPage.menus.entries?.visible,
          readonly:
            getUserAuthorization.value.fileSystemPage.menus.entries?.readonly,
        },
        {
          label: 'Add Funds',
          separator: false,
          to: { name: 'add-funds', path: '/add-funds' },
          visible:
            getUserAuthorization.value.fileSystemPage.menus.entries?.visible,
          readonly:
            getUserAuthorization.value.fileSystemPage.menus.entries?.readonly,
        },
        {
          label: 'My Wallet',
          separator: false,
          to: { name: 'my-wallet', path: '/my-wallet' },
          visible:
            getUserAuthorization.value.fileSystemPage.menus.entries?.visible,
          readonly:
            getUserAuthorization.value.fileSystemPage.menus.entries?.readonly,
        },
      ],
    },
    {
      icon: MENU_ICON.RECYCLE_BIN,
      label: 'Recycle bin',
      separator: false,
      to: { name: RECYCLE_BIN_ROUTE_NAMES.ENTRIES },
      visible: getUserAuthorization.value.recycleBinPage.menus.entries?.visible,
      readonly:
        getUserAuthorization.value.recycleBinPage.menus.entries?.readonly,
    },
  ]
})
</script>
