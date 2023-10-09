<template>
  <q-card
    flat
    class="bg-grey-1"
  >
    <q-card-section class="text-caption text-disable"
      >Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur
      ducimus tempore nemo architecto ipsum dolorum harum cumque asperiores
      fugit laboriosam ipsa placeat, minima eum ad, doloribus expedita
      consequatur atque voluptate.</q-card-section
    >
    <q-card-section>
      <q-btn
        unelevated
        round
        size="sm"
        @click="onViewDetail"
      >
        <q-icon name="north_east"></q-icon>
      </q-btn>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
// methods
function onViewDetail() {
  console.log('onViewDetail')
}
</script>
