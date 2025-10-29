import { useInfiniteQuery } from "@tanstack/react-query";
import { InfiniteTable } from "./components/InfiniteTable";
import type { MRT_ColumnDef, MRT_TableOptions } from "material-react-table";
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

  const handleCreateProduct: MRT_TableOptions<Product>["onCreatingRowSave"] =
    async ({ values, table }) => {
      //validate
      // const newValidationErrors = validateUser(values);
      // if (Object.values(newValidationErrors).some((error) => error)) {
      //   setValidationErrors(newValidationErrors);
      //   return;
      // }

      //if passed
      // setValidationErrors({});
      // await createUser(values);
      table.setCreatingRow(null); //exit creating mode
    };

  return (
    <InfiniteTable
      data={flatData}
      columns={columns}
      onFetchMore={fetchNextPage}
      isError={isError}
      isFetching={isFetching}
      isLoading={isLoading}
      createDisplayMode="row"
      editDisplayMode="row"
      enableEditing
      onCreatingRowSave={handleCreateProduct}
      // onCreatingRowCancel={() => setValidationErrors({})}
      // onEditingRowCancel={() => setValidationErrors({})}
      // onEditingRowSave={handleUpdateProduct}
      renderRowActions={({ table, row }) => (
        <>
          {" "}
          <button onClick={() => table.setEditingRow(row)}>Edit</button>
          <button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this product?")
              ) {
                // deleteUser(row.original.id);
              }
            }}>
            Delete
          </button>
        </>
      )}
      renderTopToolbarCustomActions={({ table }) => (
        <button onClick={() => table.setCreatingRow(true)}>
          Add New Product
        </button>
      )}
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
