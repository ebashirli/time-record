"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateEmployee } from "./update-employee-action";
import type { EmployeeFormState } from "./employee-form-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { DialogClose } from "../ui/dialog";
import {
  BloodType,
  Nationality,
  Sex,
} from "@/prisma/lib/generated/prisma/browser";

interface Employee {
  id: string;
  firstName: string | null;
  middleName: string | null;
  patronymic: string | null;
  lastName: string | null;
  fullName: string | null;
  idCardSerie: string | null;
  idCardNo: string | null;
  idCardPin: string | null;
  nationality: string | null;
  sex: string | null;
  birthDate: Date | null;
  bloodType: string | null;
  phoneNumber: string | null;
  emergencyPhoneNumber: string | null;
  shift: string | null;
  hireDate: Date | null;
  terminationDate: Date | null;
  cardId: string;
  image: string | null;
  departmentId: string;
  positionId: string;
  isActive: boolean | null;
}

interface Department {
  id: string;
  name: string;
}

interface Position {
  id: string;
  name: string;
}

interface EmployeeEditFormProps {
  employee: Employee;
  departments: Department[];
  positions: Position[];
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating...
        </>
      ) : (
        "Update Employee"
      )}
    </Button>
  );
}

export function EmployeeEditForm({
  employee,
  departments,
  positions,
}: EmployeeEditFormProps) {
  const initialState: EmployeeFormState = { message: "", success: undefined };

  const updateEmployeeWithId = updateEmployee.bind(null, employee.id);
  const [state, formAction] = useActionState(
    updateEmployeeWithId,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        // You can add navigation here if needed
        // router.push('/employees');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
    <form action={formAction} className="space-y-6">
      {state.message && (
        <Alert variant={state.success ? "default" : "destructive"}>
          {state.success ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="identification">ID</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic employee details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={employee.firstName || ""}
                    placeholder="Enter first name"
                  />
                  {state.errors?.firstName && (
                    <p className="text-sm text-red-500">
                      {state.errors.firstName[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue={employee.lastName || ""}
                    placeholder="Enter last name"
                  />
                  {state.errors?.lastName && (
                    <p className="text-sm text-red-500">
                      {state.errors.lastName[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    defaultValue={employee.middleName || ""}
                    placeholder="Enter middle name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patronymic">Patronymic</Label>
                  <Input
                    id="patronymic"
                    name="patronymic"
                    defaultValue={employee.patronymic || ""}
                    placeholder="Enter patronymic"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    defaultValue={employee.fullName || ""}
                    placeholder="Auto-generated or custom full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <Select name="sex" defaultValue={employee.sex || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Sex.MALE}>Male</SelectItem>
                      <SelectItem value={Sex.FEMALE}>Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    defaultValue={formatDateForInput(employee.birthDate)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select
                    name="nationality"
                    defaultValue={employee.nationality || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Nationality.AZERBAIJANI}>
                        Azerbaijan
                      </SelectItem>
                      <SelectItem value={Nationality.TURKISH}>
                        Turkey
                      </SelectItem>
                      <SelectItem value={Nationality.RUSSIAN}>
                        Russia
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select
                    name="bloodType"
                    defaultValue={employee.bloodType || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BloodType.O_I_RH_POSITIVE}>
                        A+
                      </SelectItem>
                      <SelectItem value={BloodType.O_I_RH_NEGATIVE}>
                        A-
                      </SelectItem>
                      <SelectItem value={BloodType.A_II_RH_POSITIVE}>
                        B+
                      </SelectItem>
                      <SelectItem value={BloodType.A_II_RH_NEGATIVE}>
                        B-
                      </SelectItem>
                      <SelectItem value={BloodType.B_III_RH_POSITIVE}>
                        AB+
                      </SelectItem>
                      <SelectItem value={BloodType.B_III_RH_NEGATIVE}>
                        AB-
                      </SelectItem>
                      <SelectItem value={BloodType.AB_IV_RH_POSITIVE}>
                        O+
                      </SelectItem>
                      <SelectItem value={BloodType.AB_IV_RH_NEGATIVE}>
                        O-
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Identification */}
        <TabsContent value="identification">
          <Card>
            <CardHeader>
              <CardTitle>Identification Documents</CardTitle>
              <CardDescription>ID card and PIN information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idCardSerie">ID Card Serie</Label>
                  <Select
                    name="idCardSerie"
                    defaultValue={employee.idCardSerie || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select serie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AZE">AZE</SelectItem>
                      <SelectItem value="AA">AA</SelectItem>
                      <SelectItem value="MYX">MYX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idCardNo">ID Card Number</Label>
                  <Input
                    id="idCardNo"
                    name="idCardNo"
                    defaultValue={employee.idCardNo || ""}
                    placeholder="Enter ID card number"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="idCardPin">ID Card PIN</Label>
                  <Input
                    id="idCardPin"
                    name="idCardPin"
                    defaultValue={employee.idCardPin || ""}
                    placeholder="Enter PIN (uppercase letters and numbers)"
                  />
                  {state.errors?.idCardPin && (
                    <p className="text-sm text-red-500">
                      {state.errors.idCardPin[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="cardId">
                    Card ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cardId"
                    name="cardId"
                    defaultValue={employee.cardId}
                    placeholder="Enter card ID"
                  />
                  {state.errors?.cardId && (
                    <p className="text-sm text-red-500">
                      {state.errors.cardId[0]}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employment Information */}
        <TabsContent value="employment">
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
              <CardDescription>
                Position, department, and work schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departmentId">
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="departmentId"
                    defaultValue={employee.departmentId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {state.errors?.departmentId && (
                    <p className="text-sm text-red-500">
                      {state.errors.departmentId[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="positionId">
                    Position <span className="text-red-500">*</span>
                  </Label>
                  <Select name="positionId" defaultValue={employee.positionId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos.id} value={pos.id}>
                          {pos.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {state.errors?.positionId && (
                    <p className="text-sm text-red-500">
                      {state.errors.positionId[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shift">Shift</Label>
                  <Select
                    name="shift"
                    defaultValue={employee.shift || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Day">Day</SelectItem>
                      <SelectItem value="Night">Night</SelectItem>
                      <SelectItem value="Rotating">Rotating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hireDate">Hire Date</Label>
                  <Input
                    id="hireDate"
                    name="hireDate"
                    type="date"
                    defaultValue={formatDateForInput(employee.hireDate)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terminationDate">Termination Date</Label>
                  <Input
                    id="terminationDate"
                    name="terminationDate"
                    type="date"
                    defaultValue={formatDateForInput(employee.terminationDate)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 h-10">
                    <Switch
                      id="isActive"
                      name="isActive"
                      defaultChecked={employee.isActive ?? true}
                      onCheckedChange={(checked) => {
                        const input = document.createElement("input");
                        input.type = "hidden";
                        input.name = "isActive";
                        input.value = checked.toString();
                        document
                          .getElementById("isActive")
                          ?.parentElement?.appendChild(input);
                      }}
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      Active Employee
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Phone numbers and emergency contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    defaultValue={employee.phoneNumber || ""}
                    placeholder="+994 XX XXX XX XX"
                  />
                  {state.errors?.phoneNumber && (
                    <p className="text-sm text-red-500">
                      {state.errors.phoneNumber[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhoneNumber">Emergency Phone</Label>
                  <Input
                    id="emergencyPhoneNumber"
                    name="emergencyPhoneNumber"
                    type="tel"
                    defaultValue={employee.emergencyPhoneNumber || ""}
                    placeholder="+994 XX XXX XX XX"
                  />
                  {state.errors?.emergencyPhoneNumber && (
                    <p className="text-sm text-red-500">
                      {state.errors.emergencyPhoneNumber[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image">Profile Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    defaultValue={employee.image || ""}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </DialogClose>
        <SubmitButton />
      </div>
    </form>
  );
}
