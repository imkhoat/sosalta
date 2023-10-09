<template>
  <q-layout
    view="hHh lpR lFf"
    class="text-accent"
    ><q-header
      bordered
      class="bg-white text-accent"
    >
      <q-toolbar class="row justify-between">
        <div class="row justify-start">
          <q-toolbar-title>
            <brand-logo></brand-logo>
          </q-toolbar-title>
        </div>
        <div
          v-if="!isAuthenticated"
          class="row justify-end items-center q-gutter-x-sm"
        >
          <q-btn
            unelevated
            color="primary"
            :to="{ name: AUTH_ROUTE_NAMES.LOGIN }"
            >Login</q-btn
          >
          <q-btn
            unelevated
            color="primary"
            :to="{ name: AUTH_ROUTE_NAMES.SIGNUP }"
            >Register</q-btn
          >
        </div>
        <div
          v-else
          class="row justify-end items-center q-gutter-x-sm"
        >
          <q-btn
            unelevated
            color="primary"
            :to="{ name: FILE_SYSTEM_ROUTE_NAMES.ENTRIES }"
            >Access system</q-btn
          >
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container class="public-page-container q-mb-xxl">
      <router-view />
    </q-page-container>
    <q-footer>
      <the-footer></the-footer>
    </q-footer>
  </q-layout>
</template>
<script lang="ts" setup>
import TheFooter from 'components/layouts/the-footer.vue'
import BrandLogo from 'components/molecules/brand-logo.vue'
import { AUTH_ROUTE_NAMES } from 'src/pages/auth/router'
import { useAuthStore } from 'src/core/stores/auth'
import { FILE_SYSTEM_ROUTE_NAMES } from 'src/pages/file-system/router'

const { isAuthenticated } = useAuthStore()
</script>
