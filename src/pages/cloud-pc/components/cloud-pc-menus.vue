<template>
  <q-btn
    outline
    size="md"
    class="q-px-sm"
    color="primary"
  >
    <q-icon
      size="xs"
      name="more_vert"
    ></q-icon>
    <q-menu>
      <q-list style="min-width: 100px">
        <q-item
          v-for="(menu, index) in visibleMenus"
          :key="index"
          :to="{ name: menu.to }"
          clickable
          v-close-popup
          :active="activeMenu === menu.to"
          active-class="bg-grey-1 text-primary no-wrap"
        >
          <q-item-section class="text-no-wrap">{{ menu.name }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { CLOUD_PC_ROUTE_NAMES } from '../router'
import { computed, ref, watch } from 'vue'
import { useMenusVisible } from 'src/pages/cloud-pc/hooks/use-menus-visible'

// composables
const route = useRoute()
const {
  hasDataDriveMenuVisible,
  hasCloudPCMenuVisible,
  hasMachinePrivateMenuVisible,
  hasMachinePublicMenuVisible,
} = useMenusVisible()
//data
const activeMenu = ref<string | undefined>(CLOUD_PC_ROUTE_NAMES.DATA_DRIVE)

//computed
const menus = computed(() => {
  return [
    {
      name: 'Data Drives',
      to: CLOUD_PC_ROUTE_NAMES.DATA_DRIVE,
      visible: hasDataDriveMenuVisible.value,
    },
    {
      name: 'Machine Images',
      to: CLOUD_PC_ROUTE_NAMES.MACHINE_IMAGE,
      visible:
        hasMachinePublicMenuVisible.value || hasMachinePrivateMenuVisible.value,
    },
    {
      name: 'Cloud PC',
      to: CLOUD_PC_ROUTE_NAMES.MACHINE_INSTANCES,
      visible: hasCloudPCMenuVisible.value,
    },
  ]
})

const visibleMenus = computed(() => {
  return menus.value.filter((item) => item.visible)
})

watch(
  () => route.fullPath,
  () => {
    activeMenu.value = route.name?.toString()
  },
  {
    immediate: true,
  }
)
</script>
