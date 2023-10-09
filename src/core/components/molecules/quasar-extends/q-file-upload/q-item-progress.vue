<template>
  <q-card
    flat
    bordered
    class="rounded-borders full-width cursor-pointer"
  >
    <q-card-section class="row justify-start items-start q-px-sm q-py-md">
      <q-avatar
        color="grey-1"
        text-color="primary-3"
        class="q-mr-sm"
        size="md"
      >
        <q-icon name="r_description"></q-icon>
      </q-avatar>
      <div class="column justify-start items-stretch q-mr-sm col-grow">
        <strong class="text-disable"
          >IM_2023.01_Holiday&Annual leave_2023_Eng_scan (1)</strong
        >
        <span class="text-disable text-caption q-mb-xs">200 KB</span>
        <q-linear-progress
          rounded
          :value="0.4"
          color="primary"
          size="sm"
        />
      </div>
      <q-btn
        size="sm"
        round
        unelevated
      >
        <q-icon
          size="xs"
          name="delete_outline"
        ></q-icon>
      </q-btn>
    </q-card-section>
  </q-card>
</template>
