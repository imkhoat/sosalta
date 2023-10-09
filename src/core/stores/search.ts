import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useSearchStore = defineStore('application-search', () => {
  // state
  const searchKeyword = useStorage(
    'application-search-searchKeyword',
    '',
    sessionStorage
  )

  // getter
  const getSearchKeyword = computed(() => {
    return searchKeyword.value
  })

  // actions
  function updateSearchKeyword(key: string) {
    searchKeyword.value = key
  }

  function resetSearchKeyword() {
    updateSearchKeyword('')
  }

  return {
    searchKeyword,
    getSearchKeyword,
    resetSearchKeyword,
    updateSearchKeyword,
  }
})
