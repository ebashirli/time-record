"use client";
import { useEffect } from "react";
import {
  startEmployeeSyncManager,
  stopEmployeeSyncManager,
} from "@/lib/dexie/employeeSync";

export function EmployeeSyncManager() {
  useEffect(() => {
    startEmployeeSyncManager();
    return () => stopEmployeeSyncManager();
  }, []);
  return null;
}
