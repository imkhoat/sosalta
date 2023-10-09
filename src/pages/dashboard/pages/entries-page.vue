<template>
  <div class="row dashboard-page full-height q-col-gutter-md">
    <div class="col-12 col-md-4 col-lg-3 col-xl-3">
      <quick-access-links></quick-access-links>
    </div>
    <div class="col-12 col-md-8 col-lg-9 col-xl-9">
      <div class="row q-col-gutter-sm">
        <div
          v-for="i in 2"
          :key="i"
          class="col-6"
        >
          <q-card
            flat
            class="rounded-xl q-pa-xl"
          >
            <q-card-section
              class="column justify-center items-center q-gutter-y-sm"
            >
              <q-avatar
                color="grey-1"
                text-color="primary-5"
                size="88px"
                class="q-mr-sm"
              >
                <q-avatar
                  color="grey-3"
                  text-color="primary-5"
                  size="66px"
                >
                  <q-icon
                    size="lg"
                    name="sym_o_handyman"
                  ></q-icon>
                </q-avatar>
              </q-avatar>
              <strong
                class="text-body2 text-weight-bold text-center text-disable"
                >This feature is in maintenance mode</strong
              >
              <span class="text-caption text-disable"
                >Please come back later</span
              >
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const QuickAccessLinks = defineAsyncComponent(
  () => import('src/pages/dashboard/components/quick-access-links.vue')
)
</script>
