"use client";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/dexie/db";
import { Badge } from "./ui/badge";

export function PendingSyncBadge() {
  const pendingCount = useLiveQuery(() => db.pendingActions.count());

  if (!pendingCount) return null;

  return (
    <Badge variant="secondary" title="Göndərilməyi gözləyən qeydlər">
      {pendingCount} gözləyir
    </Badge>
  );
}
