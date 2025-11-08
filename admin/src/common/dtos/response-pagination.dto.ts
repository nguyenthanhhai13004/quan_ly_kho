export interface ResponsePaginationDto<T> {
  items: T[]; 
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
