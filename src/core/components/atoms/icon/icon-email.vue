<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    :width="width"
    :height="height"
  >
    <path
      fill="#007ad9"
      d="M14,9h20c5.523,0,10,4.477,10,10v21c0,1.105-0.895,2-2,2H14V9z"
    />
    <linearGradient
      id="kaYchZIaFDSq7yXfSigRUa"
      x1="7.205"
      x2="20.183"
      y1="379.03"
      y2="345.055"
      gradientTransform="matrix(1 0 0 -1 0 390)"
      gradientUnits="userSpaceOnUse"
    >
      <stop
        offset="0"
        stop-color="#32bdef"
      />
      <stop
        offset="1"
        stop-color="#1ea2e4"
      />
    </linearGradient>
    <path
      fill="url(#kaYchZIaFDSq7yXfSigRUa)"
      d="M14,9C8.477,9,4,13.477,4,19v21c0,1.105,0.895,2,2,2h16c1.105,0,2-0.895,2-2V19 C24,13.477,19.523,9,14,9z"
    />
    <path
      fill="#007ad9"
      d="M17,21h-7c-0.552,0-1-0.448-1-1l0,0c0-0.552,0.448-1,1-1h7c0.552,0,1,0.448,1,1l0,0 C18,20.552,17.552,21,17,21z"
    />
    <rect
      width="15"
      height="2"
      x="30"
      y="17"
      fill="#cf1928"
    />
    <path
      fill="#cf1928"
      d="M42,22v-5h3c0.552,0,1,0.448,1,1v4c0,0.552-0.448,1-1,1h-2C42.448,23,42,22.552,42,22z"
    />
    <circle
      cx="30"
      cy="18"
      r="2"
      fill="#d9414f"
    />
  </svg>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IconSuccess',
  props: {
    width: {
      type: String,
      default: '24px',
    },
    height: {
      type: String,
      default: '24px',
    },
  },
})
</script>
