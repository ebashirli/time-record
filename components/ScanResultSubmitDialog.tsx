"use client";

import { getEmployeeByPin, submitCheckIn } from "@/actions/scan-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
  useTransition,
} from "react";
import Image from "next/image";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { Direction } from "@/prisma/lib/generated/prisma/browser";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Employee = {
  id: string;
  firstName: string;
  fullName: string;
  lastName: string;
  image: string;
  company: { name: string };
  position: { name: string };
  department: { name: string };
};

type Props = {
  pin: string | null;
  setPin: Dispatch<SetStateAction<string>>;
};

export function ScanResultSubmitDialog({ pin, setPin }: Props) {
  // Step 1: Triggered immediately when QR code hits the lens

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!pin) return;
    const handleScanSuccess = (scannedId: string) => {
      startTransition(async () => {
        try {
          const { data, error } = await getEmployeeByPin(scannedId);
          if (error) toast.error(error);
          if (data) setEmployee(data as Employee);
        } catch (err) {
          console.log({ err });
        }
      });
    };

    handleScanSuccess(pin);
  }, [pin]);

  function handleClose(open: boolean) {
    if (open) return;
    setPin("");
  }

  return (
    <Dialog open={!!employee} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Employee Check-in</DialogTitle>
          <DialogDescription>Confirm attendance status</DialogDescription>
        </DialogHeader>
        {isPending ? (
          <Spinner />
        ) : (
          employee && (
            <div className="flex flex-col gap-6">
              <EmployeeCard employee={employee} />
              <Form employee={employee} />
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}

function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {employee.image && (
        <Image
          src={employee.image}
          alt={
            employee.fullName || `${employee.firstName} ${employee.lastName}`
          }
          className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
        />
      )}
      <div className="text-center">
        <h3 className="font-semibold text-lg">{employee.fullName}</h3>
        <p className="text-xs text-slate-500">{employee.company.name}</p>
        <p className="text-sm text-slate-600">{employee.department.name}</p>
      </div>
    </div>
  );
}

function Form({ employee }: { employee: Employee }) {
  const [state, formAction, isPending] = useActionState(submitCheckIn, null);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    const checkin = state?.data;
    if (checkin)
      toast.success(`${checkin.employeeId} checkied in successfully`);
  }, [state]);

  return (
    <form action={formAction}>
      <Input type="hidden" name="employeeId" value={employee.id} />
      <div className="flex w-full justify-between  gap-3">
        <InOutButton direction={Direction.IN} isPending={isPending} />
        <InOutButton direction={Direction.OUT} isPending={isPending} />
      </div>
    </form>
  );
}

function InOutButton({
  direction,
  isPending,
}: {
  direction: Direction;
  isPending: boolean;
}) {
  return (
    <Button
      disabled={isPending}
      value={direction}
      type="submit"
      name="direction"
      className={cn(
        "py-4 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-3 font-semibold text-base",
        // selectedStatus === "going"
        //   ? "border-blue-500 bg-blue-50 text-blue-900"
        //   :,
        // selectedStatus === "coming"
        //   ? "border-green-500 bg-green-50 text-green-900"
        //   :
        "border-slate-300 bg-white text-slate-700",
        direction === Direction.OUT
          ? "hover:border-blue-300 hover:bg-blue-50"
          : "hover:border-green-300 hover:bg-green-50",
      )}
    >
      {direction === Direction.OUT ? (
        <LogIn className="w-5 h-5" />
      ) : (
        <LogOut className="w-5 h-5" />
      )}
      {direction === Direction.OUT ? "Exit" : "Entry"}
    </Button>
  );
}

{
  /* <Button
disabled={isPending}
value={Direction.IN}
type="submit"
name="direction"
className={`py-4 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-3 font-semibold text-base ${
// selectedStatus === "coming"
//   ? "border-green-500 bg-green-50 text-green-900"
//   :
"border-slate-300 bg-white text-slate-700 hover:border-green-300 hover:bg-green-50"
}`}
>
<LogIn className="w-5 h-5" />
Entry
</Button> */
}

{
  /* <Button
disabled={isPending}
value={Direction.OUT}
type="submit"
name="direction"
className={`py-4 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-3 font-semibold text-base ${
// selectedStatus === "going"
//   ? "border-blue-500 bg-blue-50 text-blue-900"
//   :
"border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
}`}
>
<LogOut className="w-5 h-5" />
Exit
</Button>  */
}
