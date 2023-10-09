<template>
  <q-layout
    view="hHh lpR lFf"
    class="text-accent"
  >
    <q-header
      bordered
      class="bg-white text-accent"
    >
      <q-toolbar class="row justify-between">
        <div class="row justify-start">
          <q-btn
            dense
            flat
            round
            icon="r_menu"
            @click="toggleDrawer"
          />
          <q-toolbar-title>
            <brand-logo></brand-logo>
          </q-toolbar-title>
        </div>
        <div class="row justify-end items-center q-gutter-x-sm">
          <the-top-action></the-top-action>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      bordered
      :mini="miniDrawer"
      side="left"
      class="q-pa-sm column justify-between no-wrap"
    >
      <q-card
        v-if="isMedium"
        flat
      >
        <q-card-section>
          <brand-logo width="124px"></brand-logo>
        </q-card-section>
        <q-separator></q-separator>
      </q-card>
      <the-sidebar></the-sidebar>
      <div
        v-if="!isMobile"
        class="absolute mini-drawer-btn"
      >
        <q-btn
          dense
          round
          text
          unelevated
          color="blue-2"
          text-color="primary"
          :icon="miniDrawerIcon"
          @click="toggleMiniDrawer()"
        />
      </div>
      <div>
        <user-storage :mini="miniDrawer && !isMobile"></user-storage>
        <q-separator class="q-my-md" />
        <user-logout :mini="miniDrawer && !isMobile"></user-logout>
      </div>
      <the-footer v-if="!miniDrawer"></the-footer>
    </q-drawer>

    <q-page-container class="main-page-container">
      <q-page
        class="q-pa-sm q-pa-md-lg"
        :class="{
          'fit-height': !isMobile && !noFitHeight,
          'bg-background': !noBackground,
        }"
      >
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import TheSidebar from 'components/layouts/the-sidebar.vue'
import TheTopAction from 'components/layouts/the-top-action.vue'
import UserStorage from 'components/molecules/user-storage.vue'
import UserLogout from 'components/molecules/user-logout.vue'
import BrandLogo from 'components/molecules/brand-logo.vue'
import TheFooter from 'components/layouts/the-footer.vue'
import { useRoute } from 'vue-router'
import { httpsGetUserProfile } from 'src/core/services/user-services'

export default defineComponent({
  name: 'MainLayout',
  components: {
    TheSidebar,
    UserStorage,
    UserLogout,
    BrandLogo,
    TheTopAction,
    TheFooter,
  },
  setup() {
    // const store = useApplicationStore()
    const $q = useQuasar()
    const drawer = ref(false)
    const miniDrawer = ref(true)
    const route = useRoute()

    const miniDrawerIcon = computed(() => {
      return miniDrawer.value ? 'chevron_right' : 'chevron_left'
    })
    const isMobile = computed(() => {
      return $q.screen.lt.sm
    })
    const isMedium = computed(() => {
      return $q.screen.lt.md
    })

    const noBackground = computed(() => {
      return route.meta?.noBackground
    })

    const noFitHeight = computed(() => {
      return route.meta?.noFitHeight
    })

    const toggleDrawer = () => {
      drawer.value = !drawer.value
    }
    const toggleMiniDrawer = () => {
      miniDrawer.value = !miniDrawer.value
    }

    const onFetchingMe = () => {
      httpsGetUserProfile()
    }

    onMounted(() => {
      // store.toggleFooterMountedState()
      onFetchingMe()
    })

    return {
      drawer,
      miniDrawer,
      miniDrawerIcon,
      isMobile,
      isMedium,
      noFitHeight,
      noBackground,
      toggleDrawer,
      toggleMiniDrawer,
    }
  },
})
</script>
<style>
.mini-drawer-btn {
  top: 15px;
  right: -17px;
}

.main-page-container {
  max-height: calc(100vh);
  overflow: hidden;
  overflow-y: scroll;
}
</style>
