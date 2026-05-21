"use client";
// import { EmployeeForm } from "@/components/employee-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Edit, MapPin, Briefcase, Calendar } from "lucide-react";
import Image from "next/image";
import { Employee } from "@/prisma/lib/generated/prisma/browser";

interface Props {
  employee:
    | ({
        department: {
          id: string;
          name: string;
        };
        position: {
          id: string;
          name: string;
        };
      } & Employee)
    | null;
}

export default function EmployeeDetails({ employee }: Props) {
  if (!employee) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back Home
            </Button>
          </Link>
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-center text-lg">Employee not found</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back Home
          </Button>
        </Link>

        {/* Header Card with Image */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {employee.image && (
                <Image
                  src={employee.image}
                  alt={employee.fullName ?? ""}
                  width={100}
                  height={100}
                  className="w-32 h-32 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {employee.fullName ||
                    `${employee.firstName} ${employee.lastName}`}
                </h1>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{employee.position.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{employee.department.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Hired{" "}
                      {new Date(employee.hireDate || "").toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      employee.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <Link href={`/employees/${employee.id}/edit`}>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Details Form (Read-only) */}
        {/* <EmployeeForm employee={employee} isEditing={false} /> */}
      </div>
    </main>
  );
}
