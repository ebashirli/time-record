"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/DeleteDialog";
import { QRGenerator } from "@/components/QRGenerator";
import { deleteEmployee } from "@/actions/deleteEmployee";
import { EmployeeRow } from "./types";

export function getEmployeeColumns(
  setData: Dispatch<SetStateAction<EmployeeRow[]>>,
): ColumnDef<EmployeeRow>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        </div>
      ),
      size: 1,
    },
    {
      accessorKey: "#",
      header: () => <div className="">#</div>,
      cell: ({ row }) => (
        <div className="font-medium text-right w-6">{row.getValue("#")}</div>
      ),
      size: 10,
      maxSize: 1,
    },
    {
      accessorKey: "fullName",
      header: () => <div className="">Full Name</div>,
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-lg">
              {employee.image && (
                <AvatarImage
                  src={"/api/images/" + employee.image}
                  alt={"profile image: " + (employee.fullName ?? "")}
                />
              )}
              <AvatarFallback className="rounded-lg">
                {employee.fullName?.slice(0, 2).toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{employee.fullName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "cardId",
      header: () => <div className="">Card ID</div>,
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("cardId")}</div>
      ),
    },
    {
      accessorKey: "companyName",
      header: () => <div className="">Company</div>,
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("companyName")}</div>
      ),
    },
    {
      accessorKey: "departmentName",
      header: () => <div className="">Department</div>,
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("departmentName")}</div>
      ),
    },
    {
      accessorKey: "positionName",
      header: () => <div className="">Position</div>,
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("positionName")}</div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div
            className="flex items-center justify-end gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="outline" size="icon" asChild>
              <Link href={`/employees/${employee.id}/edit`}>
                <Pencil />
              </Link>
            </Button>
            <QRGenerator value={employee.cardId} />
            <DeleteDialog
              deleteAction={deleteEmployee}
              id={employee.id}
              setData={setData}
            />
          </div>
        );
      },
    },
  ];
}
