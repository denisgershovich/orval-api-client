import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_RowVirtualizer,
  type MRT_SortingState,
} from "material-react-table";

import AXIOS_INSTANCE from "../lib/axios/axiosClient";
import { Table } from "./Table";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
};

const columns: MRT_ColumnDef<Product>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "category", header: "Category" },
];

export const ProductsTable = () => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

  const { data, fetchNextPage, isError, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["products"],
      queryFn: fetchProducts,
      initialPageParam: 0,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      refetchOnWindowFocus: false,
    });

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (scrollHeight - scrollTop - clientHeight < 400 && !isFetching) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching],
  );

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const flatData = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data],
  );

  return (
    <Table
      columns={columns}
      data={flatData}
      enablePagination={false}
      enableRowNumbers={true}
      enableRowVirtualization={true}
      manualFiltering={true}
      manualSorting={true}
      muiTableContainerProps={{
        ref: tableContainerRef,
        sx: { maxHeight: "600px" },
        onScroll: (event: React.UIEvent<HTMLDivElement>) =>
          fetchMoreOnBottomReached(event.target as HTMLDivElement),
      }}
      muiToolbarAlertBannerProps={
        isError
          ? {
              color: "error",
              children: "Error loading data",
            }
          : undefined
      }
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onSortingChange={setSorting}
      state={{
        columnFilters,
        globalFilter,
        isLoading,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting,
      }}
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
      rowVirtualizerOptions={{ overscan: 4 }}
    />
  );
};

const fetchProducts = async ({ pageParam = 0 }) => {
  const limit = 10;
  const { data } = await AXIOS_INSTANCE.get(
    `https://dummyjson.com/products?limit=${limit}&skip=${pageParam}`,
  );

  return {
    products: data.products,
    nextSkip: data.skip + limit < data.total ? data.skip + limit : undefined,
  };
};
