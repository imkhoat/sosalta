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
          href="https://github.com/atlas-os-team/doc"
          target="_blank"
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
                  name="sym_o_integration_instructions"
                  class="material-icons-round"
                ></q-icon>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none"
            >Docs</q-item-section
          >
        </q-item>
        <q-item
          clickable
          class="row justify-start"
          :to="{ name: PUBLIC_ROUTE_NAMES.SUPPORT }"
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
                  name="sym_o_support"
                  class="material-icons-round"
                ></q-icon>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none"
            >Support</q-item-section
          >
        </q-item>
        <q-item
          clickable
          class="row justify-start"
          :to="{ name: PUBLIC_ROUTE_NAMES.VIP }"
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
                  name="sym_o_subscriptions"
                  class="material-icons-round"
                ></q-icon>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none"
            >Subscription</q-item-section
          >
        </q-item>
        <q-item
          clickable
          class="row justify-start"
          :to="{ name: PUBLIC_ROUTE_NAMES.PRICING }"
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
                  name="sym_o_money"
                  class="material-icons-round"
                ></q-icon>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none"
            >Pricing</q-item-section
          >
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
  <template v-else>
    <div
      class="the-top-public-action row justify-end items-center q-gutter-x-sm"
    >
      <q-btn
        size="sm"
        rounded
        round
        flat
        class="q-px-xs"
        href="https://github.com/atlas-os-team/doc"
        target="_blank"
      >
        <q-icon
          size="22px"
          name="sym_o_integration_instructions"
        ></q-icon>
        Docs
        <q-tooltip>Docs</q-tooltip>
      </q-btn>
      <q-btn
        size="sm"
        rounded
        round
        flat
        class="q-px-xs"
        :to="{ name: PUBLIC_ROUTE_NAMES.SUPPORT }"
      >
        <q-icon
          size="22px"
          name="sym_o_support"
        ></q-icon>
        Support
        <q-tooltip>Support</q-tooltip>
      </q-btn>
      <q-btn
        size="sm"
        rounded
        round
        flat
        :to="{ name: PUBLIC_ROUTE_NAMES.VIP }"
      >
        <q-icon
          size="22px"
          name="sym_o_subscriptions"
        ></q-icon>
        <q-tooltip>Subscription</q-tooltip>
      </q-btn>
      <q-btn
        size="sm"
        rounded
        round
        flat
        :to="{ name: PUBLIC_ROUTE_NAMES.PRICING }"
      >
        <q-icon
          size="22px"
          name="sym_o_money"
        ></q-icon>
        <q-tooltip>Pricing</q-tooltip>
      </q-btn>
    </div>
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
