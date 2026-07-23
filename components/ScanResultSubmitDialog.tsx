"use client";

import { Separator } from "@/components/ui/separator";
import { lookupEmployee } from "@/lib/dexie/lookupEmployee";
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { CachedEmployee } from "@/lib/dexie/db";
import { CheckInForm } from "./CheckInForm";

type Props = {
  cardId: string | null;
  setIdCard: React.Dispatch<React.SetStateAction<string | null>>;
};

type ScanState =
  | { status: "idle" }
  | { status: "found"; employee: CachedEmployee }
  | { status: "not_found" }
  | { status: "network_error" }
  | { status: "no_gate"; message: string };

export function ScanResultSubmitDialog({ cardId, setIdCard }: Props) {
  const [scanState, setScanState] = useState<ScanState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!cardId) return;

    startTransition(async () => {
      const result = await lookupEmployee(cardId);

      if (result.status === "found") {
        setScanState({ status: "found", employee: result.employee });
      } else {
        setScanState(result);
      }
    });
  }, [cardId]);

  function handleClose(open?: boolean) {
    if (open) return;
    setIdCard(null);
    setScanState({ status: "idle" });
  }

  return (
    <Dialog open={!!cardId} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Employee Check-in</DialogTitle>
          <DialogDescription>Confirm attendance status</DialogDescription>
        </DialogHeader>
        {isPending ? (
          <Spinner />
        ) : (
          <ScanResultBody scanState={scanState} onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ScanResultBody({
  scanState,
  onClose,
}: {
  scanState: ScanState;
  onClose: (open?: boolean) => void;
}) {
  switch (scanState.status) {
    case "idle":
      return null;
    case "not_found":
      return <p className="text-destructive">Kart tanınmadı</p>;
    case "network_error":
      return (
        <p className="text-destructive">
          Serverlə əlaqə yoxdur — bağlantını yoxlayıb kartı yenidən oxudun
        </p>
      );
    case "no_gate":
      return <p className="text-destructive">{scanState.message}</p>;
    case "found":
      return (
        <div className="flex flex-col gap-6">
          <EmployeeCard employee={scanState.employee} />
          <CheckInForm cardId={scanState.employee.cardId} reset={onClose} />
        </div>
      );
  }
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
            {employee.lastAction
              ? employee.lastAction === Direction.IN
                ? "Giriş"
                : "Çıxış"
              : "İlk dəfə"}
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
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!blob) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImgSrc(null);
      return;
    }

    // 1. Blob-dan müvəqqəti URL yaradırıq (məs: blob:http://localhost:3000/...)
    const url = URL.createObjectURL(blob);
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
