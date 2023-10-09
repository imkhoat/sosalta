<template>
  <suspense class="q-skeleton-suspense">
    <slot />
    <template #fallback>
      <q-card
        flat
        class="q-skeleton-suspense__fallback rounded-borders"
      >
        <q-card-section>
          <q-skeleton
            type="text"
            width="30%"
            class="text-caption"
          />
          <q-skeleton
            type="text"
            class="text-subtitle1"
          />
          <q-skeleton
            type="text"
            class="text-subtitle1 q-mb-md"
          />
          <q-skeleton
            type="text"
            width="30%"
            class="text-caption"
          />
          <q-skeleton
            type="text"
            class="text-subtitle1"
          />
          <q-skeleton
            type="text"
            class="text-subtitle1"
          />
          <q-skeleton
            type="text"
            class="text-subtitle1"
          />
          <q-skeleton
            type="text"
            class="text-subtitle1"
          />
        </q-card-section>
      </q-card>
    </template>
  </suspense>
</template>
<style lang="scss">
.q-skeleton-suspense {
  &__fallback {
    width: 480px;
  }
}
</style>
