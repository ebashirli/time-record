"use client";

import * as React from "react";
import {
  // Column,
  ColumnDef,
  ColumnFiltersState,
  // SortingState,
  RowSelectionState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  useReactTable,
} from "@tanstack/react-table";

import {
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
import { Skeleton } from "../ui/skeleton";
import { DataTablePagination } from "./DataTablePagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface I {
  id: string;
}

interface DataTableProps<TData extends I, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowCount?: number;
  loading?: boolean;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
}

export function DataTable<TData extends I, TValue>({
  columns,
  data,
  rowCount,
  loading,
  filters,
  actions,
  rowSelection,
  onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
  // const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const pageIndex = Math.max(
    0,
    parseInt(searchParams.get("page") || "0", 10) || 0,
  );
  const pageSize = Math.max(
    1,
    parseInt(searchParams.get("limit") || "20", 10) || 20,
  );
  const manualPagination = rowCount !== undefined;
  const pageCount = manualPagination
    ? Math.max(1, Math.ceil(rowCount / pageSize))
    : undefined;

  const setPagination = React.useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;

      const params = new URLSearchParams(searchParams);

      if (next.pageIndex <= 0) params.delete("page");
      else params.set("page", String(next.pageIndex));

      if (next.pageSize === 20) params.delete("limit");
      else params.set("limit", String(next.pageSize));

      replace(`${pathname}?${params.toString()}`);
    },
    [pageIndex, pageSize, pathname, replace, searchParams],
  );

  React.useEffect(() => {
    if (!manualPagination || pageCount === undefined) return;

    const maxPageIndex = pageCount - 1;
    if (pageIndex <= maxPageIndex) return;

    const params = new URLSearchParams(searchParams);
    if (maxPageIndex <= 0) params.delete("page");
    else params.set("page", String(maxPageIndex));

    replace(`${pathname}?${params.toString()}`);
  }, [manualPagination, pageCount, pageIndex, pathname, replace, searchParams]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      // sorting,
      columnVisibility,
      rowSelection: rowSelection ?? {},
      columnFilters,
      pagination: { pageIndex, pageSize },
    },
    pageCount,
    rowCount,
    manualPagination,
    autoResetPageIndex: false,
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange,
    // onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(manualPagination
      ? {}
      : { getPaginationRowModel: getPaginationRowModel() }),
    getSortedRowModel: getSortedRowModel(),
    // getFacetedRowModel: getFacetedRowModel(),
    // getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // const columnsRefs = table
  //   .getAllColumns()
  //   .filter((column) => column.getCanHide());

  const { rows } = table.getRowModel();

  return (
    <div className="flex flex-col gap-2 px-2 sm:px-4 h-full min-h-0">
      <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4 min-w-0">
        <div className="min-w-0 flex-1">{filters}</div>

        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          {actions}
          {/* <ColumnSelector columns={columnsRefs} /> */}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col rounded-md border overflow-hidden">
        <div className="min-h-0 flex-1 overflow-auto" key={pageIndex}>
          <table className="w-full min-w-3xl caption-bottom text-sm">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="sticky top-0 z-10 bg-muted shadow-[inset_0_-1px_0_hsl(var(--border))]"
                      >
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
            <TableBody>
              {loading ? (
                Array.from({ length: Math.min(pageSize, 15) }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {columns.map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows?.length ? (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      replace(`${pathname}/${row.id}?${params.toString()}`);
                    }}
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
        </div>
        <div className="shrink-0 border-t bg-background py-2">
          <DataTablePagination table={table} />
        </div>
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
//         <Button
//           size="icon"
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
