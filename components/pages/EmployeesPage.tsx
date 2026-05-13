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
  fullName: string;
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
    setEmployees((prev: Employee[]) => [...prev, ...data.employees]);
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
          {employee.fullName && (
            <AvatarImage src={employee.fullName} alt={employee.fullName} />
          )}
          <AvatarFallback className="rounded-lg">
            {employee.fullName.at(0)}
          </AvatarFallback>
        </Avatar>
        <CardTitle>{employee.fullName}</CardTitle>
        <CardDescription>{employee.position.name}</CardDescription>
      </CardHeader>
      <CardContent>{employee.company.name}</CardContent>
    </Card>
  );
};
