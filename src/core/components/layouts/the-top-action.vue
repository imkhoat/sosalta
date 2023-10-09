<template>
  <div class="the-headerbar row justify-end items-center q-gutter-x-sm no-wrap">
    <the-resource-menus></the-resource-menus>
    <the-chat-drawer></the-chat-drawer>
    <the-notification-drawer></the-notification-drawer>
    <the-account-menus></the-account-menus>
    <the-change-locale></the-change-locale>
  </div>
</template>
<script lang="ts" setup>
import TheChangeLocale from 'components/layouts/the-change-locale.vue'
import TheChatDrawer from 'src/core/components/layouts/the-chat-drawer.vue'
import TheAccountMenus from 'src/core/components/layouts/the-account-menus.vue'
import TheResourceMenus from 'src/core/components/layouts/the-resource-menus.vue'
import TheNotificationDrawer from 'src/core/components/layouts/the-notification-drawer.vue'
</script>
