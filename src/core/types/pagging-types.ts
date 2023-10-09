export interface Pagging {
  currPage: number
  pageSize: number
  totalCount: number
  totalPage: number
}

export interface TablePagination {
  sortBy: 'desc' | 'asc'
  descending: boolean
  page: number
  rowsPerPage: number
  rowsNumber: number
  totalPage: number
}
