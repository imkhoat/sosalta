<template>
  <q-card
    flat
    class="maintenance-mode rounded-xl q-pa-xl"
  >
    <q-card-section class="column justify-center items-center q-gutter-y-sm">
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
            name="sym_o_verified_user"
          ></q-icon>
        </q-avatar>
      </q-avatar>
      <strong class="text-h6 text-weight-bold text-center"
        >This feature is in maintenance mode</strong
      >
      <span class="text-caption text-disabled">Please come back later</span>
      <q-btn
        color="primary"
        push
        >Back to home page</q-btn
      >
    </q-card-section>
  </q-card>
</template>
