import { Direction } from "@/prisma/lib/generated/prisma/enums";
import Dexie, { type EntityTable } from "dexie";

// ---------- Types ----------

export type SyncStatus = "pending" | "syncing" | "failed";

export interface CachedEmployee {
  cardId: string; // primary key — the QR/card identifier
  fullName: string;
  companyName: string;
  departmentName: string;
  positionName: string;
  lastAction: Direction | null; // null if never scanned anywhere yet
  lastActionAt: string | null; // ISO timestamp
  cachedAt: string; // ISO timestamp — when this record was first cached
  id: string;
  image: string | null;
  imageBlob?: Blob | null;
}

export interface PendingAction {
  employeeId: string;
  clientEventId: string; // primary key — UUID, also the idempotency key sent to server
  // cardId: string;
  action: Direction;
  // gateId: string;
  dateTime: string; // ISO timestamp — when the guard actually tapped
  syncStatus: SyncStatus;
  retryCount: number;
  lastError?: string; // optional, last failure reason — useful for debugging stuck items
}

// ---------- Database ----------

class DB extends Dexie {
  employees!: EntityTable<CachedEmployee, "cardId">;
  pendingActions!: EntityTable<PendingAction, "clientEventId">;

  constructor() {
    super("shift-db");

    this.version(1).stores({
      // cardId is the primary key (&cardId not needed since it's the PK, implicitly unique)
      employees: "cardId, lastAction, cachedAt",

      // clientEventId is the primary key.
      // Indexes:
      //  - syncStatus: to quickly query all non-synced rows for the badge + retry loop
      //  - cardId: to look up an employee's own pending history (for the duplicate-warning check)
      //  - occurredAt: to order the retry queue and pending-list display chronologically
      pendingActions: "clientEventId, syncStatus, cardId, dateTime",
    });
  }
}

export const db = new DB();
