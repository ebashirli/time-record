import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DeleteDialog } from "./DeleteDialog";
import { Button } from "./ui/button";
import { deleteEmployee } from "@/actions/deleteEmployee";
import { QRGenerator } from "./QRGenerator";

type Employee = {
  id: string;
  cardId: string;
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
                  alt={employee.fullName ?? ""}
                />
              )}
              <AvatarFallback className="rounded-lg">
                {employee.fullName?.slice(0, 2).toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{employee.fullName}</CardTitle>
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
            <QRGenerator value={employee.cardId} />
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
