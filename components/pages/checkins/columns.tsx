"use client";

import { ColumnDef } from "@tanstack/react-table";
// import { MoreHorizontal } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { CheckinRow } from "./types";
import dayjs from "dayjs";

export const columns: ColumnDef<CheckinRow>[] = [
  {
    accessorKey: "fullName",
    header: () => <div className="">Full Name</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("fullName")}</div>;
    },
  },
  {
    accessorKey: "departmentName",
    header: () => <div className="">Department</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue("departmentName")}</div>
      );
    },
  },
  {
    accessorKey: "checkedByName",
    header: () => <div className="">Terminal</div>,
    cell: ({ row }) => {
      return (
        <div className=" font-medium">{row.getValue("checkedByName")}</div>
      );
    },
  },
  {
    accessorKey: "dateTime",
    header: () => <div className="text-right">Date/Time</div>,
    cell: ({ row }) => {
      const dateTime = dayjs(Date.parse(row.getValue("dateTime"))).format(
        "HH:mm",
      );
      // const formatted = new Intl.NumberFormat("en-US", {
      //   style: "currency",
      //   currency: "USD",
      // }).format(amount);

      return <div className="text-right font-medium">{dateTime}</div>;
    },
  },
  {
    accessorKey: "direction",
    header: () => <div className="text-right">Direction</div>,
    cell: ({ row }) => {
      // const dateTime = Date.parse(row.getValue("dateTime"));
      // const formatted = new Intl.NumberFormat("en-US", {
      //   style: "currency",
      //   currency: "USD",
      // }).format(amount);

      return (
        <div className="text-right font-medium">
          {row.getValue("direction")}
        </div>
      );
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const payment = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(payment.id)}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
