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
        <div class="row justify-end items-center q-gutter-x-sm no-wrap">
          <the-top-public-action></the-top-public-action>
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
import TheTopPublicAction from 'components/layouts/the-top-public-action.vue'
</script>
