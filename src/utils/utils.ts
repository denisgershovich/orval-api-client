import { type MRT_RowData, type MRT_TableOptions } from 'material-react-table';

//default table options for all tables
export const getDefaultMRTOptions = <TData extends MRT_RowData>(): Partial<
  MRT_TableOptions<TData>
> => ({
  enableGlobalFilter: false,
  enableRowPinning: true,
  initialState: { showColumnFilters: true },
  manualFiltering: true,
  manualPagination: true,
  manualSorting: true,
  muiTableHeadCellProps: {
    sx: { fontSize: '1.1rem' },
  },
  paginationDisplayMode: 'pages',
  defaultColumn: {
    //default column options here
  },
});
