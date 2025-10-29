import { useState, useRef, useCallback, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_RowData,
  type MRT_RowVirtualizer,
  type MRT_SortingState,
  type MRT_TableOptions,
} from "material-react-table";

interface InfiniteTableProps<TData extends MRT_RowData>
  extends MRT_TableOptions<TData> {
  columns: MRT_ColumnDef<TData>[];
  data: TData[];
  onFetchMore: () => void;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  hasMore?: boolean;
}

export const InfiniteTable = <TData extends MRT_RowData>({
  columns,
  data,
  isLoading = false,
  isFetching = false,
  isError = false,
  onFetchMore,
  hasMore = true,
  ...options
}: InfiniteTableProps<TData>) => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

  const table = useMaterialReactTable({
    columns,
    data,
    enablePagination: false,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    manualFiltering: true,
    manualSorting: true,
    muiTableContainerProps: {
      ref: tableContainerRef,
      sx: { maxHeight: "600px" },
      onScroll: (event: React.UIEvent<HTMLDivElement>) =>
        fetchMoreOnBottomReached(event.currentTarget),
    },
    muiToolbarAlertBannerProps: isError
      ? { color: "error", children: "Error loading data" }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    rowVirtualizerInstanceRef: rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 4 },
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
    },
    ...options,
  });

  const fetchMoreOnBottomReached = useCallback(
    (container?: HTMLDivElement | null) => {
      if (!container || !onFetchMore || !hasMore || isFetching) return;

      const { scrollHeight, scrollTop, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 400) {
        onFetchMore();
      }
    },
    [onFetchMore, hasMore, isFetching],
  );

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  return <MaterialReactTable table={table} />;
};
