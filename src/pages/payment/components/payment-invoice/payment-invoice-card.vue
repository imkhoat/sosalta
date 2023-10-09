<template>
  <q-card flat>
    <q-card-section>
      <q-section-header
        title="Bill to"
        sub-title="Please input your address information."
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <span class="text-caption text-disable">Information</span>
      <q-input
        dense
        id="name"
        label="Name"
        stack-label
        outlined
        v-model="invoice.name"
        class="q-mb-md"
      >
      </q-input>
      <q-input
        dense
        id="phone"
        label="Phone"
        stack-label
        outlined
        v-model="invoice.phone"
        class="q-mb-md"
      >
      </q-input>
      <q-input
        dense
        id="email"
        label="Email"
        stack-label
        outlined
        v-model="invoice.email"
        class="q-mb-md"
      >
      </q-input>
      <q-input
        dense
        id="po"
        label="PO#"
        stack-label
        outlined
        v-model="invoice.po"
        class="q-mb-md"
      >
      </q-input>
    </q-card-section>
    <q-card-section>
      <span class="text-caption text-disable">Address</span>
      <q-input
        dense
        id="stress_address"
        label="Stress Address"
        stack-label
        outlined
        v-model="invoice.stress"
        class="q-mb-md"
      >
      </q-input>
      <q-input
        dense
        id="apt"
        label="Apt/Suit Number"
        stack-label
        outlined
        v-model="invoice.apt"
        class="q-mb-md"
      >
      </q-input>
      <q-input
        dense
        id="email"
        label="City/Tower"
        stack-label
        outlined
        v-model="invoice.city"
        class="q-mb-md"
      >
      </q-input>
      <q-input
        dense
        id="po"
        label="State/Province"
        stack-label
        outlined
        v-model="invoice.state"
        class="q-mb-md"
      >
      </q-input>
      <q-input
        dense
        id="po"
        label="Country"
        stack-label
        outlined
        v-model="invoice.country"
        class="q-mb-md"
      >
      </q-input>
      <q-input
        dense
        id="po"
        label="Zip code/Postal code"
        stack-label
        outlined
        v-model="invoice.zip"
        class="q-mb-md"
      >
      </q-input>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, reactive, unref } from 'vue'
import { Invoice } from 'src/core/types/invoice-types'
const props = withDefaults(
  defineProps<{
    modelValue: Invoice
  }>(),
  {
    modelValue: {
      name: '',
      phone: '',
      email: '',
      po: '',
      stress: '',
      city: '',
      state: '',
      apt: '',
      zip: '',
      country: '',
    },
  }
)
const emits = defineEmits(['update:modelValue'])

const invoice = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})
</script>
