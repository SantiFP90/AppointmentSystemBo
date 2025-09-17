export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface ApiResponsePaged<T> {
  success: boolean;
  message?: string;
  data?: PagedResult<T>;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
