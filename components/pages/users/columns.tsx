"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "./types";
import dayjs from "dayjs";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "#",
    header: () => <div className="">#</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium text-right w-6">{row.getValue("#")}</div>
      );
    },
    size: 10,
    maxSize: 1,
  },
  {
    accessorKey: "name",
    header: () => <div className="">Name</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "role",
    header: () => <div className="">Role</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("role")}</div>;
    },
  },
  {
    accessorKey: "email",
    header: () => <div className="">Email</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("email")}</div>;
    },
  },
  {
    id: "gateName",
    accessorFn: (row) => row.gateName,
    header: () => <div className="">Gate</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("gateName")}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Created at</div>,
    cell: ({ row }) => {
      const date = dayjs(Date.parse(row.getValue("createdAt"))).format(
        "DD/MM/YYYY",
      );
      return <div className="text-right font-medium">{date}</div>;
    },
  },
];
