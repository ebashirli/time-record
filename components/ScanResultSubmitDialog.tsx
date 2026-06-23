"use client";

import { Separator } from "@/components/ui/separator";
import { getEmployeeByCardId, submitCheckIn } from "@/actions/scan-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, {
  useActionState,
  useEffect,
  useState,
  useTransition,
} from "react";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { Direction } from "@/prisma/lib/generated/prisma/browser";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { CachedEmployee, db } from "@/lib/dexie/db";
import { fetchAndSaveEmployeeImage } from "@/lib/dexie/fetchAndSaveEmployeeImage";

type Props = {
  cardId: string | null;
  setIdCard: React.Dispatch<React.SetStateAction<string | null>>;
};

export function ScanResultSubmitDialog({ cardId, setIdCard }: Props) {
  // Step 1: Triggered immediately when QR code hits the lens
  const [employee, setEmployee] = useState<CachedEmployee | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!cardId) return;
    const handleScanSuccess = async (scanned: string) => {
      const cached = await db.employees.get(scanned);
      if (cached) return setEmployee(cached);

      startTransition(async () => {
        const { data, error } = await getEmployeeByCardId(scanned);

        if (error) toast.error(error);
        if (data) {
          const imageBlob = await fetchAndSaveEmployeeImage(data.image);
          const employee = { ...data, imageBlob };
          await db.employees.put(employee);
          setEmployee(employee);
        }
      });
    };

    (async () => {
      await handleScanSuccess(cardId);
    })();
  }, [cardId]);

  function handleClose(open?: boolean) {
    if (open) return;
    setIdCard(null);
    setEmployee(null);
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
              <Form employee={employee} reset={handleClose} />
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}

function EmployeeCard({ employee }: { employee: CachedEmployee }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <EmployeeImage
        image={employee.image}
        fullName={employee.fullName}
        blob={employee.imageBlob}
      />

      <div className="text-center">
        <h3 className="font-semibold text-lg">{employee.fullName}</h3>
        <p className="text-xs text-slate-500">{employee.companyName}</p>
        <p className="text-sm text-slate-600">{employee.departmentName}</p>
        <p className="text-xs text-slate-500">{employee.positionName}</p>
        <Separator className="my-3" />
        <div className="flex flex-col items-center ">
          <p className="mb-2">Sonuncu hərəkət</p>
          <Badge className="text-xl font-bold p-7 py-6 ">
            {employee.lastAction ?? "İlk dəfə"}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function Form({
  employee,
  reset,
}: {
  employee: CachedEmployee;
  reset: (open?: boolean) => void;
}) {
  const [state, formAction, isPending] = useActionState(submitCheckIn, null);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    const checkin = state?.data;
    if (checkin) {
      toast.success(`${checkin.employee.fullName} checked in successfully`);
      reset();
    }
  }, [state, reset]);

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
        direction === Direction.OUT
          ? "border-blue-500 bg-blue-50 text-blue-900"
          : direction === Direction.IN
            ? "border-green-500 bg-green-50 text-green-900"
            : "border-slate-300 bg-white text-slate-700",
        direction === Direction.OUT
          ? "hover:border-blue-300 hover:bg-blue-50"
          : "hover:border-green-300 hover:bg-green-50",
      )}
    >
      {direction === Direction.OUT ? (
        <LogOut className="w-5 h-5" />
      ) : (
        <LogIn className="w-5 h-5" />
      )}
      {direction === Direction.OUT ? "Çıxış" : "Giriş"}
    </Button>
  );
}

interface EmployeeImageProps {
  image?: string | null;
  fullName: string;
  blob?: Blob | null;
}

export default function EmployeeImage({
  blob,
  fullName,
  image,
}: EmployeeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>("");

  console.log({ blob, fullName, image, imgSrc });

  useEffect(() => {
    if (!blob) return;

    // 1. Blob-dan müvəqqəti URL yaradırıq (məs: blob:http://localhost:3000/...)
    const url = URL.createObjectURL(blob);
    console.log({ url });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImgSrc(url);

    // 2. CLEANUP: Komponent ekrandan itəndə yaddaşı mütləq təmizləyirik
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  return (
    <Avatar className="h-36 w-36 rounded-lg">
      {image && (
        <AvatarImage
          src={imgSrc ?? "/api/images/" + image}
          alt={"profile image" + (fullName ?? "")}
        />
      )}
      <AvatarFallback className="rounded-lg">
        {fullName?.slice(0, 2).toLocaleUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
