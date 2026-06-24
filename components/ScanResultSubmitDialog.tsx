"use client";

import { Separator } from "@/components/ui/separator";
import { getEmployeeByCardId } from "@/actions/scan-actions";
import { Direction } from "@/prisma/lib/generated/prisma/browser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useState, useTransition } from "react";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { CachedEmployee, db } from "@/lib/dexie/db";
import { fetchAndSaveEmployeeImage } from "@/lib/dexie/fetchAndSaveEmployeeImage";
import { CheckInForm } from "./CheckInForm";

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
              <CheckInForm
                cardId={employee.cardId}
                employeeId={employee.id}
                reset={handleClose}
              />
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
            {employee.lastAction ? employee.lastAction === Direction.IN ? "Giriş" : "Çıxış" : "İlk dəfə"}
          </Badge>
        </div>
      </div>
    </div>
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
