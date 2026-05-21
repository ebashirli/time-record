"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Employee } from "@/prisma/lib/generated/prisma/browser";
import EmployeeDetails from "./EmployeeDetails";

export default function EmployeeModal({
  employee,
}: {
  employee:
    | ({
        department: {
          id: string;
          name: string;
        };
        position: {
          id: string;
          name: string;
        };
      } & Employee)
    | null;
}) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) router.push("/employees", { scroll: false });
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{employee?.fullName}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <EmployeeDetails employee={employee} />
      </DialogContent>
    </Dialog>
  );
}
