"use client";

import { LogIn, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import {
  checkAction,
  commitAction,
  describeLastAction,
} from "@/lib/dexie/recordAction";
import { Direction } from "@/prisma/lib/generated/prisma/browser";

const DIRECTION_LABEL: Record<Direction, string> = {
  IN: "Giriş",
  OUT: "Çıxış",
};

interface CheckInFormProps {
  cardId: string; // this should be the cardId your scan flow already resolved
  reset: (open?: boolean) => void;
}

export function CheckInForm({ cardId, reset }: CheckInFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    direction: Direction;
    warningText: string;
  } | null>(null);

  async function handleDirectionClick(direction: Direction) {
    setIsPending(true);
    try {
      const result = await checkAction(cardId, direction);

      if (result.status === "needs_confirmation") {
        setConfirmState({
          direction,
          warningText: describeLastAction(
            result.lastAction,
            result.lastActionAt,
          ),
        });
        return; // wait for explicit confirm — nothing written yet
      }

      if (result.status === "employee_not_cached") {
        toast.error("İşçi məlumatı tapılmadı, kartı yenidən oxudun");
        return;
      }

      // status === "recorded" — checkAction already called commitAction
      // internally since there was no duplicate.
      toast.success(`${DIRECTION_LABEL[direction]} qeydə alındı`);
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Qeyd edilmədi, yenidən cəhd edin");
    } finally {
      setIsPending(false);
    }
  }

  async function handleConfirm() {
    if (!confirmState) return;
    setIsPending(true);
    try {
      await commitAction(cardId, confirmState.direction);
      setConfirmState(null);
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Qeyd edilmədi, yenidən cəhd edin");
    } finally {
      setIsPending(false);
    }
  }

  if (confirmState) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p>{confirmState.warningText} — təsdiq edirsiniz?</p>
        <div className="flex gap-3">
          <Button onClick={handleConfirm} disabled={isPending}>
            Bəli, təsdiqlə
          </Button>
          <Button onClick={() => setConfirmState(null)} disabled={isPending}>
            Ləğv et
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-between gap-3">
      <div className="flex w-full justify-between  gap-3">
        <InOutButton
          direction={Direction.IN}
          isPending={isPending}
          onClick={() => handleDirectionClick(Direction.IN)}
        />
        <InOutButton
          direction={Direction.OUT}
          isPending={isPending}
          onClick={() => handleDirectionClick(Direction.OUT)}
        />
      </div>
    </div>
  );
}

function InOutButton({
  direction,
  isPending,
  onClick,
}: {
  direction: Direction;
  isPending: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      disabled={isPending}
      value={direction}
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
      onClick={onClick}
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
