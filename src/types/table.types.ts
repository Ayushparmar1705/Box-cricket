import type { ReactNode } from "react";
import type { PaginationInfo } from "./common.types";

export interface Column<T> {
  key: Extract<keyof T, string> | string;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

export interface CommonTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor?: (item: T) => string | number;
  loading?: boolean;
  emptyMessage?: string;

  // Actions
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  customActions?: (item: T) => ReactNode;

  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Pagination
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
}
