import { Table } from "./Table";
import type { MRT_ColumnDef } from "material-react-table";

export type User = {
  id: number;
  name: string;
  age: number;
};

const data: User[] = [
  { id: 1, name: "John", age: 20 },
  { id: 2, name: "Jane", age: 21 },
  { id: 3, name: "Jim", age: 22 },
  { id: 4, name: "Jill", age: 23 },
];

export const UserTable = () => {
  const columns: MRT_ColumnDef<User>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "age", header: "Age" },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      state={
        {
          // isLoading: true,
          // showProgressBars: true, //progress bars while refetching
          // isSaving: true,
        }
      }
    />
  );
};
