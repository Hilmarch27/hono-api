export type Paging = {
  current_page: number
  total_page: number
  size: number
  total_items: number
}

export type Pageable<T> = {
  data: Array<T>
  paging: Paging
}
