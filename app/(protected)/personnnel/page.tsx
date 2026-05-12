import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { Employee as TEmployee } from "@/prisma/lib/generated/prisma/client";
export default async function Page() {
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    skip: 0,
    include: { position: true, company: true },
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {employees.map((employee) => (
          <Employee key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
}

type Props = {
  employee: TEmployee & {
    position: {
      id: string;
      name: string;
    };
    company: {
      id: string;
      name: string;
    };
  };
};

export const Employee = ({ employee }: Props) => {
  if (!employee) return null;

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
