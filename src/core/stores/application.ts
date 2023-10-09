import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useApplicationStore = defineStore('application', () => {
  // state
  const footerMounted = ref<boolean>(false)
  const configuration = useStorage(
    'application-configuration',
    {
      baseURL: process.env.BASE_API_URL,
    },
    sessionStorage
  )

  // getter
  const getConfiguration = computed(() => {
    return configuration.value
  })

  const getBaseURL = computed(() => {
    return configuration.value?.baseURL ?? process.env.BASE_API_URL
  })

  // action
  function toggleFooterMountedState() {
    footerMounted.value = !footerMounted.value
  }
  function changeBaseURL(baseURL: string) {
    configuration.value.baseURL = baseURL
  }
  return {
    getConfiguration,
    getBaseURL,
    toggleFooterMountedState,
    changeBaseURL,
  }
})
