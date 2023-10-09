<template>
  <q-page class="login-page row items-stretch justify-center">
    <div class="col-xs-0 col-sm-0 col-md-7 col-lg-8 col-xl-9">
      <q-img
        src="~/assets/common/login-background.jpg"
        spinner-color="white"
        fit="cover"
        class="window-height full-width"
      >
      </q-img>
    </div>
    <div class="col-xs-12 col-sm-8 col-md-5 col-lg-4 col-xl-3">
      <login-form></login-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import LoginForm from 'pages/auth/components/login-form.vue'
</script>
