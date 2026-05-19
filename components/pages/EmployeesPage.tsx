"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CustomInfiniteScroll from "../CustomInfiniteScroll";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  image?: string;
  position: {
    id: string;
    name: string;
  };
  company: {
    id: string;
    name: string;
  };
};

const EmployeesPage = () => {
  const [employees, setEmployees] = React.useState<Employee[]>([]);

  function setData(data: { employees: Employee[] }) {
    const employees = data.employees.map(
      ({ firstName, fullName, lastName, ...props }) => ({
        ...props,
        firstName,
        lastName,
        fullName,
      }),
    );
    setEmployees((prev: Employee[]) => [...prev, ...employees]);
  }

  return (
    <CustomInfiniteScroll setData={setData} name="employees">
      <>
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </>
    </CustomInfiniteScroll>
  );
};

export default EmployeesPage;

export const EmployeeCard = ({ employee }: { employee: Employee }) => {
  return (
    <Card
      size="sm"
      className="mx-auto w-full max-w-sm aspect-video rounded-xl bg-muted/50"
    >
      <CardHeader>
        <Avatar className="h-8 w-8 rounded-lg">
          {employee && (
            <AvatarImage
              src={employee.image}
              alt={
                employee.fullName ||
                `${employee.firstName} ${employee.lastName}`
              }
            />
          )}
          <AvatarFallback className="rounded-lg">
            {employee.fullName.at(0)}
          </AvatarFallback>
        </Avatar>
        <CardTitle>
          {employee.fullName || `${employee.firstName} ${employee.lastName}`}
        </CardTitle>
        <CardDescription>{employee.position.name}</CardDescription>
      </CardHeader>
      <CardContent>{employee.company.name}</CardContent>
    </Card>
  );
};
