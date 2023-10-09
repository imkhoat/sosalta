<template>
  <div
    class="the-footer column justify-center items-center bg-white text-accent q-pa-sm text-center text-normal"
  >
    <span class="text-caption text-disable"
      >Copyright © 2023 Shannon Inc. All rights reserved.</span
    >
    <div class="row justify-center items-center">
      <q-btn
        size="sm"
        class="q-px-sm"
        rounded
        round
        flat
        :to="{ name: PUBLIC_ROUTE_NAMES.TERM }"
      >
        Terms and Conditions of Use
      </q-btn>
      <q-btn
        size="sm"
        class="q-px-sm"
        rounded
        round
        flat
        :to="{ name: PUBLIC_ROUTE_NAMES.POLICY }"
      >
        Privacy Policy
      </q-btn>
      <q-btn
        size="sm"
        class="q-px-sm"
        rounded
        round
        flat
        :to="{ name: PUBLIC_ROUTE_NAMES.DISCLAIMER }"
      >
        Disclaimer
      </q-btn>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PUBLIC_ROUTE_NAMES } from 'src/pages/public/router'
</script>
