<template>
  <q-card
    flat
    class="bg-positive text-white q-pa-sm"
  >
    <q-card-section>
      <strong class="text-weight-bold text-h6 block"
        >Atlas OS charges two types of fees: Cloud Computing Fee (CCF), and
        Service Fee (SF).</strong
      >
    </q-card-section>
    <q-card-section class="text-disable">
      <p>
        1. Atlas OS Cloud Computing Fee (CCF) covers data storage, outbound data
        transmission (inbound data transmission is free), EC2 computing
        instance, and EBS volume cost from infrastructure providers like AWS.
      </p>
      <p>
        2. Atlas OS Service Fee (SF) is the cost to maintain and update Atlas OS
        system, and is equivalent to 30% of the total Atlas OS cloud computing
        fee.
        <br />If the actual cost of a billing period is less than $0.01, then
        $0.01 will be charged for that period.
      </p>
    </q-card-section>
  </q-card>
</template>
