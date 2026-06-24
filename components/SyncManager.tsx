"use client";
import { useEffect } from "react";
import { startSyncManager, stopSyncManager } from "@/lib/dexie/syncQueue";

export function SyncManager() {
  useEffect(() => {
    startSyncManager();
    return () => stopSyncManager();
  }, []);
  return null;
}
