"use client";

import * as React from "react";
import {
  // Column,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  // getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
// import { IconButton } from "../IconButton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Columns3Icon } from "lucide-react";
import { Spinner } from "../ui/spinner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  filters,
  actions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  // const columnsRefs = table
  //   .getAllColumns()
  //   .filter((column) => column.getCanHide());

  const { rows } = table.getRowModel();

  return (
    <div className="px-2 h-full flex flex-col ">
      <div className="grid md:flex items-center justify-between my-2 ">
        {filters}

        <div className="flex items-center gap-2 mt-2 md:mt-0 w-fit">
          {actions}
          {/* <ColumnSelector columns={columnsRefs} /> */}
        </div>
      </div>
      <div className="overflow-hidden rounded-md border grow">
        <Table className="max-h-full">
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="overflow-y-scroll">
            {rows?.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className=""
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center border"
                >
                  {!!loading ? <Spinner className="mx-auto" /> : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// const ColumnSelector = <TData, TValue>({
//   columns,
// }: {
//   columns: Column<TData, TValue>[];
// }) => {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger>
//         <IconButton
//           icon={<Columns3Icon />}
//           variant="outline"
//           className="ml-auto"
//           tooltip="Select columns"
//           asChild
//         />
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="min-w-44">
//         {columns.map((column) => (
//           <DropdownMenuCheckboxItem
//             key={column.id}
//             className="capitalize"
//             checked={column.getIsVisible()}
//             onCheckedChange={(value) => column.toggleVisibility(!!value)}
//           >
//             {(typeof column.columnDef?.header === 'function'
//                 ? column.columnDef.header(column.getContext())?.props?.children
//                 : column.columnDef?.header) ?? column.id}
//           </DropdownMenuCheckboxItem>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };
