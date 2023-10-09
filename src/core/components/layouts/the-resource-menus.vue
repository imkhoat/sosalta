<template>
  <q-btn
    size="sm"
    rounded
    round
    flat
    v-if="isMobile"
  >
    <q-icon
      size="22px"
      name="more_vert"
    ></q-icon>
    <q-menu class="menus-context">
      <q-list>
        <q-item
          clickable
          class="row justify-start"
        >
          <q-item-section class="col-shrink">
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
                  size="xs"
                  name="sym_o_apk_install"
                  class="material-icons-round"
                ></q-icon>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none"
            >Resource</q-item-section
          >
        </q-item>
        <q-item
          clickable
          class="row justify-start"
          :to="{ name: PUBLIC_ROUTE_NAMES.HELP }"
        >
          <q-item-section class="col-shrink">
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
                  size="xs"
                  name="sym_o_help"
                  class="material-icons-round"
                ></q-icon>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none"
            >Help</q-item-section
          >
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
  <template v-else>
    <q-btn
      size="sm"
      rounded
      round
      flat
      disable
    >
      <q-icon
        size="24px"
        name="sym_o_apk_install"
      ></q-icon>
      <q-tooltip>Resource</q-tooltip>
    </q-btn>
    <q-btn
      size="sm"
      rounded
      round
      flat
      :to="{ name: PUBLIC_ROUTE_NAMES.HELP }"
    >
      <q-icon
        size="24px"
        name="sym_o_help"
      ></q-icon>
      <q-tooltip>Help</q-tooltip>
    </q-btn>
  </template>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { PUBLIC_ROUTE_NAMES } from 'src/pages/public/router'
import { computed } from 'vue'

// composables
const $q = useQuasar()
// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
</script>
