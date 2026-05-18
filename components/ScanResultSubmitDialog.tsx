"use client";

import { getEmployeeByPin, submitCheckIn } from "@/actions/scan-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Loader } from "lucide-react";
import { InOrOutChoice } from "./pages/scanning/InOrOutChoice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  company: { name: string };
  position: { name: string };
  department: { name: string };
};

export function ScanResultSubmitDialog({
  pin,
  setPin,
}: {
  pin: string | null;
  setPin: Dispatch<SetStateAction<string>>;
}) {
  // Step 1: Triggered immediately when QR code hits the lens

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!pin) return;
    const handleScanSuccess = (scannedId: string) => {
      startTransition(async () => {
        try {
          const data = await getEmployeeByPin(scannedId);
          setEmployee(data as Employee);
        } catch (err) {
          console.log({ err });
        }
      });
    };

    handleScanSuccess(pin);
  }, [pin]);

  // Step 2: Triggered when user clicks "Confirm Check-In"
  // const handleConfirmCheckIn = async () => {
  //   if (!employee) return;
  //   try {
  //     await submitCheckIn(employee.id);
  //   } catch (err) {}
  // };

  return (
    <Dialog open={!!pin} onOpenChange={(e) => (!e ? setPin("") : undefined)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Employee information</DialogTitle>
          <DialogDescription>Check employee information</DialogDescription>
        </DialogHeader>

        {isPending && <Loader />}

        {!isPending && employee && (
          <>
            <Card className="relative mx-auto w-full max-w-sm pt-0">
              <div className="absolute inset-0 z-30 aspect-video " />
              {employee?.image && (
                <Image
                  src={employee?.image}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                />
              )}
              <CardHeader className="pt-6">
                <CardTitle>
                  {employee.firstName} {employee.lastName}
                </CardTitle>
                <CardDescription>{employee.company.name}</CardDescription>
                <CardDescription>{employee.department.name}</CardDescription>
                <CardDescription>{employee.position.name}</CardDescription>
              </CardHeader>
            </Card>

            <form action={submitCheckIn}>
              <Input type="hidden" name={"employeeId"} value={employee?.id} />
              <InOrOutChoice />

              <DialogFooter className="">
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
