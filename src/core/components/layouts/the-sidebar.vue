<template>
  <q-scroll-area
    class="fit the-sidebar"
    :thumb-style="thumbStyle"
    :bar-style="barStyle"
  >
    <sidebar-menu :items="menuList"></sidebar-menu>
  </q-scroll-area>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import SidebarMenu from 'components/molecules/sidebar-menu.vue'
import { Menu } from 'src/core/types/menu-types'
import {
  FILE_SYSTEM_ROUTE_NAMES,
  KEY_MANAGER_ROUTE_NAMES,
  ACCOUNT_SETTING_ROUTE_NAMES,
  MEMBER_USERS_ROUTE_NAMES,
  TEAM_MANAGEMENT_ROUTE_NAMES,
  PROJECT_MANAGEMENT_ROUTE_NAMES,
  CLOUD_PC_ROUTE_NAMES,
  RECYCLE_BIN_ROUTE_NAMES,
  PAYMENT_ROUTE_NAMES,
} from 'src/core/router/routes'
import { useAuthStore } from 'src/core/stores/auth'
import { MENU_ICON } from 'src/core/types/menu-icon-types'

export default defineComponent({
  components: { SidebarMenu },
  setup() {
    const { getUserAuthorization } = storeToRefs(useAuthStore())
    const menuList = computed((): Menu[] => {
      return [
        {
          icon: MENU_ICON.FILE_SYSTEM,
          label: 'File System',
          separator: true,
          to: { name: FILE_SYSTEM_ROUTE_NAMES.ENTRIES },
          visible:
            getUserAuthorization.value.fileSystemPage.menus.entries?.visible,
          readonly:
            getUserAuthorization.value.fileSystemPage.menus.entries?.readonly,
        },
        {
          icon: MENU_ICON.KEY_MANAGER,
          label: 'Key Manager',
          separator: true,
          to: { name: KEY_MANAGER_ROUTE_NAMES.ENTRIES },
          visible:
            getUserAuthorization.value.keyManagerPage.menus.entries?.visible,
          readonly:
            getUserAuthorization.value.keyManagerPage.menus.entries?.readonly,
        },
        {
          icon: MENU_ICON.CLOUD_PC,
          label: 'Cloud PC',
          separator: false,
          to: { name: CLOUD_PC_ROUTE_NAMES.ENTRIES },
          visible:
            getUserAuthorization.value.cloudPCPage.menus.entries?.visible,
          readonly:
            getUserAuthorization.value.cloudPCPage.menus.entries?.readonly,
          children: [
            {
              label: 'Data Drive',
              separator: false,
              to: { name: CLOUD_PC_ROUTE_NAMES.DATA_DRIVE },
              visible:
                getUserAuthorization.value.cloudPCPage.menus.dataDrive?.visible,
              readonly:
                getUserAuthorization.value.cloudPCPage.menus.dataDrive
                  ?.readonly,
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
                getUserAuthorization.value.cloudPCPage.menus.entries
                  ?.readonly ||
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
          visible:
            getUserAuthorization.value.memberUserPage.menus.entries?.visible,
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
          visible:
            getUserAuthorization.value.projectPage.menus.entries?.visible,
          readonly:
            getUserAuthorization.value.projectPage.menus.entries?.readonly,
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
          visible:
            getUserAuthorization.value.cloudAppPage.menus.entries?.visible,
          readonly:
            getUserAuthorization.value.cloudAppPage.menus.entries?.readonly,
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
            getUserAuthorization.value.accountSettingPage.menus.entries
              ?.visible,
          readonly:
            getUserAuthorization.value.accountSettingPage.menus.entries
              ?.readonly,
        },
        {
          icon: MENU_ICON.PAYMENT,
          label: 'Payment',
          separator: false,
          to: { name: PAYMENT_ROUTE_NAMES.INDEX },
          visible:
            getUserAuthorization.value.paymentPage.menus.entries?.visible,
          readonly:
            getUserAuthorization.value.paymentPage.menus.entries?.readonly,
          children: [
            {
              label: 'Payment Details',
              separator: false,
              to: { name: PAYMENT_ROUTE_NAMES.DETAIL },
              visible:
                getUserAuthorization.value.fileSystemPage.menus.entries
                  ?.visible,
              readonly:
                getUserAuthorization.value.fileSystemPage.menus.entries
                  ?.readonly,
            },
            {
              label: 'Payment History',
              separator: false,
              to: { name: PAYMENT_ROUTE_NAMES.HISTORY },
              visible:
                getUserAuthorization.value.fileSystemPage.menus.entries
                  ?.visible,
              readonly:
                getUserAuthorization.value.fileSystemPage.menus.entries
                  ?.readonly,
            },
            {
              label: 'Add Funds',
              separator: false,
              to: { name: PAYMENT_ROUTE_NAMES.ADD_FUND },
              visible:
                getUserAuthorization.value.fileSystemPage.menus.entries
                  ?.visible,
              readonly:
                getUserAuthorization.value.fileSystemPage.menus.entries
                  ?.readonly,
            },
            {
              label: 'My Wallet',
              separator: false,
              to: { name: PAYMENT_ROUTE_NAMES.MY_WALLET },
              visible:
                getUserAuthorization.value.fileSystemPage.menus.entries
                  ?.visible,
              readonly:
                getUserAuthorization.value.fileSystemPage.menus.entries
                  ?.readonly,
            },
          ],
        },
        {
          icon: MENU_ICON.RECYCLE_BIN,
          label: 'Recycle bin',
          separator: false,
          to: { name: RECYCLE_BIN_ROUTE_NAMES.ENTRIES },
          visible:
            getUserAuthorization.value.recycleBinPage.menus.entries?.visible,
          readonly:
            getUserAuthorization.value.recycleBinPage.menus.entries?.readonly,
        },
      ]
    })
    return {
      thumbStyle: {
        borderRadius: '100px',
        background: `linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2))`,
        width: '0.5em',
        opacity: 1,
      } as Partial<unknown>,
      barStyle: {
        boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
        width: '0.5em',
        opacity: 0.2,
      } as Partial<unknown>,
      menuList,
    }
  },
})
</script>
<style>
.the-sidebar {
  max-height: calc(100vh - 200px);
}
</style>
