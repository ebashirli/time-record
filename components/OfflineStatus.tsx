"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/dexie/db";

export function OfflineStatus() {
  const router = useRouter();
  const pendingCount = useLiveQuery(() => db.pendingActions.count());

  useEffect(() => {
    function handleOnline() {
      router.replace("/scanner");
    }
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [router]);

  if (!pendingCount) {
    return (
      <p className="text-muted-foreground">
        Göndərilməyi gözləyən qeyd yoxdur.
      </p>
    );
  }

  return (
    <p className="text-muted-foreground">
      {pendingCount} qeyd göndərilməyi gözləyir — bağlantı bərpa olunan kimi
      avtomatik göndəriləcək.
    </p>
  );
}
