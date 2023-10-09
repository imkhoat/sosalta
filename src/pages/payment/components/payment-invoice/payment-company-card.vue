<template>
  <q-card flat>
    <q-card-section>
      <q-section-header title="Shannon Genomics Inc."></q-section-header>
    </q-card-section>
    <q-card-section>
      <q-list
        bordered
        separator
        class="rounded-borders"
      >
        <q-item
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="sym_o_location_on"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Address</q-item-label>
            <q-item-label
              >786 Mountain Blvd, Suite 204 Watchung, NJ 07069 USA
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="sym_o_alternate_email"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Email</q-item-label>
            <q-item-label>info@shannongenomics.com</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="sym_o_receipt_long"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Receipt #</q-item-label>
            <q-item-label>20230702102550652746</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="sym_o_calendar_month"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Date</q-item-label>
            <q-item-label>2023-07-02 09:25 UTC+7</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
