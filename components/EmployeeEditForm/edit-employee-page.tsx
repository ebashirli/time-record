import { notFound } from "next/navigation";
import { EmployeeEditForm } from "./employee-edit-form";
import prisma from "@/lib/prisma";
import { EmployeeEditModal } from "../EmployeeEditModal";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

interface PageProps {
  id: string;
}

async function getEmployee(id: string) {
  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    return null;
  }

  return employee;
}

async function getDepartments() {
  return await prisma.department.findMany({
    orderBy: { name: "asc" },
  });
}

async function getPositions() {
  return await prisma.position.findMany({
    orderBy: { name: "asc" },
  });
}

export default async function EditEmployeePage({ id }: PageProps) {
  const [employee, departments, positions] = await Promise.all([
    getEmployee(id),
    getDepartments(),
    getPositions(),
  ]);

  if (!employee) {
    notFound();
  }

  return (
    <EmployeeEditModal open={!!employee}>
      <div className="container mx-auto">
        <DialogHeader>
          <div className="mb-8">
            <DialogTitle className="text-3xl font-bold tracking-tight">
              Edit Employee
            </DialogTitle>
            <DialogDescription>
              <p className="text-muted-foreground">
                Update employee information for {employee.firstName}{" "}
                {employee.lastName}
              </p>
            </DialogDescription>
          </div>
        </DialogHeader>

        <EmployeeEditForm
          employee={employee}
          departments={departments}
          positions={positions}
        />
      </div>
    </EmployeeEditModal>
  );
}
