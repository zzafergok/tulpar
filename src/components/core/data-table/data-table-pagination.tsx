'use client';

import * as React from 'react';
import type { RowData } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/core/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/core/select';
import { useCurrentLocale } from '@/components/providers/client-locale-provider';
import { dataTableCopy } from './constants';
import type { DataTableInstance } from './data-table';

export interface DataTablePaginationProps<TData extends RowData> {
  table: DataTableInstance<TData>;
}

export function DataTablePagination<TData extends RowData>({
  table,
}: DataTablePaginationProps<TData>) {
  const locale = useCurrentLocale();
  const copy = dataTableCopy[locale];
  const pagination = table.state.pagination;
  const pageSize = pagination?.pageSize ?? 10;
  const pageIndex = pagination?.pageIndex ?? 0;
  const pageCount = table.getPageCount();
  const displayedPage = pageCount === 0 ? 0 : pageIndex + 1;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-xs text-ash">
        {table.getFilteredRowModel().rows.length} {copy.rows}
      </div>
      <div className="flex flex-wrap items-center gap-4 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="text-xs font-medium text-ash">{copy.rowsPerPage}</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-xs font-medium text-ash">
          {copy.page} {displayedPage} {copy.of} {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{copy.firstPage}</span>
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{copy.previousPage}</span>
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{copy.nextPage}</span>
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{copy.lastPage}</span>
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
