"use client";

import { useState } from "react";
import CustomInfiniteScroll from "../CustomInfiniteScroll";
import { EmployeeCard } from "../EmployeeCard";
import { getEmployees } from "@/actions/getEmployees";
import { useSearchParams } from "next/navigation";

type Employee = {
  id: string;
  fullName: string | null;
  cardId: string;
  image: string | null;
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

export const EmployeesList = () => {
  const searchParams = useSearchParams();

  const [employees, setEmployees] = useState<Employee[]>([]);

  const query = searchParams.get("query") || "";

  return (
    <CustomInfiniteScroll
      key={query}
      setData={setEmployees}
      getAction={getEmployees}
      className="grid-cols-2"
    >
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
