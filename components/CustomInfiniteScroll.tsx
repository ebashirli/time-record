"use client";
import React from "react";

import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";

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

const CustomInfiniteScroll = () => {
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const LIMIT = 12;

  const next = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/employees?limit=${LIMIT}&skip=${LIMIT * page}`,
      );
      const data = await res.json();

      setEmployees((prev) => [...prev, ...data.employees]);
      setPage((prev) => prev + 1);

      // Check if there are more employees to load
      if (data.employees.length < LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-4 ">
        {employees.map((employee) => (
          <Employee key={employee.id} employee={employee} />
        ))}

        <div className="col-span-full flex justify-center">
          <InfiniteScroll
            hasMore={hasMore}
            isLoading={loading}
            next={next}
            threshold={1}
          >
            {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default CustomInfiniteScroll;

export const Employee = ({ employee }: { employee: Employee }) => {
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
