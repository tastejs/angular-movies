export interface PaginationState {
  totalPages: number;
  activePage: number;
  loading: boolean;
}

export type PaginationOptions = { page: number };
