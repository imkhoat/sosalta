<template>
  <q-layout>
    <q-header
      bordered
      class="bg-white text-accent"
    >
      <q-toolbar class="row justify-between">
        <brand-logo></brand-logo>
        <div class="row justify-end items-center q-gutter-x-sm no-wrap">
          <the-top-public-action></the-top-public-action>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
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
import TheTopPublicAction from 'components/layouts/the-top-public-action.vue'
</script>
