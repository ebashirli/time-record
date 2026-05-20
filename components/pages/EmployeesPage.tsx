"use client";

import { useState } from "react";
import CustomInfiniteScroll from "../CustomInfiniteScroll";
import { EmployeeCard } from "../EmployeeCard";
import { getEmployees } from "@/actions/getEmployees";

type Employee = {
  id: string;
  fullName: string | null;
  image?: string;
  position: {
    name: string;
  };
  company: {
    name: string;
  };
  department: {
    name: string;
  };
};

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  return (
    <CustomInfiniteScroll setData={setEmployees} getAction={getEmployees}>
      <>
        {employees.map((employee) => {
          return (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              setEmployees={setEmployees}
            />
          );
        })}
      </>
    </CustomInfiniteScroll>
  );
};

export default EmployeesPage;
