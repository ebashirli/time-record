"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, MapPin, Briefcase, Calendar } from "lucide-react";
import Link from "next/link";
import { Employee } from "@/prisma/lib/generated/prisma/browser";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface EmployeeDetailsModalProps {
  employee:
    | (Employee & {
        position: { id: string; name: string };
        department: { id: string; name: string };
      })
    | null;
}

export function EmployeeDetailsModal({ employee }: EmployeeDetailsModalProps) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) router.push("/employees", { scroll: false });
  };

  if (!employee) return null;

  const employeeName =
    employee.fullName || `${employee.firstName} ${employee.lastName}`;

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[70dvh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Image and Basic Info */}
          <div className="flex  gap-6">
            {employee.image && (
              <Avatar className="rounded-lg">
                {employee.image && (
                  <AvatarImage
                    src={"/external-images/" + employee.image}
                    alt={"profile image" + (employee.fullName ?? "")}
                  />
                )}
                <AvatarFallback className="rounded-lg">
                  {employee.fullName?.slice(0, 2).toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{employeeName}</h2>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>{employee.position.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{employee.department.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>
                    Hired{" "}
                    {new Date(employee.hireDate || "").toLocaleDateString()}
                  </span>
                </div>
              </div>
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

          {/* Personal Information */}
          <Card className="p-4">
            <h3 className="font-semibold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">First Name</p>
                <p className="font-medium">{employee.firstName}</p>
              </div>
              {employee.middleName && (
                <div>
                  <p className="text-muted-foreground">Middle Name</p>
                  <p className="font-medium">{employee.middleName}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Last Name</p>
                <p className="font-medium">{employee.lastName}</p>
              </div>
              {employee.birthDate && (
                <div>
                  <p className="text-muted-foreground">Birth Date</p>
                  <p className="font-medium">
                    {new Date(employee.birthDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {employee.sex && (
                <div>
                  <p className="text-muted-foreground">Sex</p>
                  <p className="font-medium">{employee.sex}</p>
                </div>
              )}
              {employee.nationality && (
                <div>
                  <p className="text-muted-foreground">Nationality</p>
                  <p className="font-medium">{employee.nationality}</p>
                </div>
              )}
              {employee.bloodType && (
                <div>
                  <p className="text-muted-foreground">Blood Type</p>
                  <p className="font-medium">{employee.bloodType}</p>
                </div>
              )}
            </div>
          </Card>

          {/* ID Information */}
          <Card className="p-4">
            <h3 className="font-semibold">ID Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {employee.idCardSerie && (
                <div>
                  <p className="text-muted-foreground">ID Card Serie</p>
                  <p className="font-medium">{employee.idCardSerie}</p>
                </div>
              )}
              {employee.idCardNo && (
                <div>
                  <p className="text-muted-foreground">ID Card Number</p>
                  <p className="font-medium">{employee.idCardNo}</p>
                </div>
              )}
              {employee.idCardPin && (
                <div>
                  <p className="text-muted-foreground">ID Card PIN</p>
                  <p className="font-medium">{employee.idCardPin}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-4">
            <h3 className="font-semibold">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {employee.phoneNumber && (
                <div>
                  <p className="text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{employee.phoneNumber}</p>
                </div>
              )}
              {employee.emergencyPhoneNumber && (
                <div>
                  <p className="text-muted-foreground">Emergency Phone</p>
                  <p className="font-medium">{employee.emergencyPhoneNumber}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Employment Information */}
          <Card className="p-4">
            <h3 className="font-semibold">Employment Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-medium">{employee.department.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Position</p>
                <p className="font-medium">{employee.position.name}</p>
              </div>
              {employee.shift && (
                <div>
                  <p className="text-muted-foreground">Shift</p>
                  <p className="font-medium">{employee.shift}</p>
                </div>
              )}
              {employee.hireDate && (
                <div>
                  <p className="text-muted-foreground">Hire Date</p>
                  <p className="font-medium">
                    {new Date(employee.hireDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {employee.cardId && (
                <div>
                  <p className="text-muted-foreground">Card ID</p>
                  <p className="font-medium">{employee.cardId}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <DialogFooter className="sm:justify-start">
            <Button asChild>
              <Link href={`/employees/${employee.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
            <DialogClose asChild>
              <Button type="button">Close</Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
