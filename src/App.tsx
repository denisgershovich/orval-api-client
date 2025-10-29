import { useInfiniteQuery } from "@tanstack/react-query";
import { InfiniteTable } from "./components/InfiniteTable";
import type { MRT_ColumnDef } from "material-react-table";
import AXIOS_INSTANCE from "./lib/axios/axiosClient";
import { useMemo } from "react";

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

function App() {
  const { data, fetchNextPage, isError, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["products"],
      queryFn: fetchProducts,
      initialPageParam: 0,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      refetchOnWindowFocus: false,
    });

  const flatData = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data],
  );

  return (
    <InfiniteTable
      data={flatData}
      columns={columns}
      onFetchMore={fetchNextPage}
      isError={isError}
      isFetching={isFetching}
      isLoading={isLoading}
    />
  );
}

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

export default App;
