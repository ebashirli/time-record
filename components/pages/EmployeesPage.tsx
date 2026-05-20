"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CustomInfiniteScroll from "../CustomInfiniteScroll";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DeleteDialog } from "../DeleteDialog";
import { deleteEmployee } from "@/actions/deleteEmployee";

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
  department: {
    id: string;
    name: string;
  };
};

const EmployeesPage = () => {
  const [employees, setEmployees] = React.useState<Employee[]>([]);

  function setData(data: Employee[]) {
    const employees =
      data.map(({ firstName, fullName, department, lastName, ...props }) => ({
        ...props,
        firstName,
        lastName,
        fullName,
        department,
      })) ?? [];
    setEmployees((prev: Employee[]) => [...prev, ...employees]);
  }

  return (
    <CustomInfiniteScroll setData={setData} name="employees">
      <>
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            setEmployees={setEmployees}
          />
        ))}
      </>
    </CustomInfiniteScroll>
  );
};

export default EmployeesPage;

export const EmployeeCard = ({
  employee,
  setEmployees,
}: {
  employee: Employee;
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}) => {
  const handlePropogation = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Card
      className={cn(
        "mx-auto w-full max-w-sm rounded-xl bg-muted/50 border-2 py-3",
        "transition-all hover:bg-accent hover:shadow-md cursor-pointer ",
      )}
    >
      <Link href={`/employees/${employee.id}`}>
        <CardHeader>
          <div className="flex items-center gap-3 min-h-14 ">
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
                {(
                  employee.fullName?.slice(0, 2) ||
                  `${employee.firstName.at(0)}${employee.lastName.at(0)}`
                ).toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle>
              {employee.fullName ||
                `${employee.firstName} ${employee.lastName}`}
            </CardTitle>
          </div>
          <CardDescription>{employee.position.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{employee.company.name}</p>
          <p>{employee.department?.name}</p>
        </CardContent>
        <Separator className="my-3" />
        <CardFooter className="flex justify-end">
          <div className="flex items-center gap-3" onClick={handlePropogation}>
            <Button
              asChild
              variant={"outline"}
              className="min-w-10 cursor-pointer "
            >
              <Pencil />
            </Button>
            <Button
              asChild
              variant={"outline"}
              className="min-w-10 cursor-pointer"
            >
              <QrCode />
            </Button>
            <DeleteDialog
              deleteAction={deleteEmployee}
              id={employee.id}
              setData={setEmployees}
            />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};
