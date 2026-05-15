"use client";

import { Can } from "@/lib/casl/hooks";
import { Employee } from "@/prisma/lib/generated/prisma/browser";
import { subject } from "@casl/ability";

export function EmployeeList({ employees }: { employees: Employee[] }) {
  return (
    <div>
      <Can I="create" a="Employee">
        <button>Add New Employee</button>
      </Can>

      {employees.map((employee) => (
        <div key={employee.id}>
          <h3>{employee.fullName}</h3>

          <Can I="update" this={subject("Employee", employee)}>
            <button>Edit</button>
          </Can>

          <Can I="delete" this={subject("Employee", employee)}>
            <button>Delete</button>
          </Can>
        </div>
      ))}
    </div>
  );
}
