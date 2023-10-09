import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { TablePagination } from '../types/pagging-types'

export const usePaginationStore = defineStore('application-pagination', () => {
  // state
  const pagination = useLocalStorage('application-pagination-pagination', {
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 3,
    rowsNumber: 10,
    totalPage: 1,
  } as Partial<TablePagination>)

  // getter
  const getPagination = computed(() => {
    return pagination.value
  })
  function updatePagination(payload: Partial<TablePagination>) {
    const { sortBy, descending, page, rowsNumber, rowsPerPage, totalPage } =
      payload
    pagination.value = {
      sortBy: sortBy ?? 'asc',
      descending: descending ?? true,
      page,
      rowsNumber,
      rowsPerPage,
      totalPage,
    }
  }

  function resetPagination() {
    updatePagination({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 10,
      totalPage: 1,
    })
  }

  return {
    pagination,
    getPagination,
    resetPagination,
    updatePagination,
  }
})
