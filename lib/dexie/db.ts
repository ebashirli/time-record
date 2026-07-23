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
  imageUpdatedAt?: string | null;
}

export interface PendingAction {
  cardId: string;
  clientEventId: string; // primary key — UUID, also the idempotency key sent to server
  action: Direction;
  // gateId is never tracked client-side — resolved server-side from the session.
  occurredAt: string; // ISO timestamp — when the guard actually tapped
  syncStatus: SyncStatus;
  retryCount: number;
  lastError?: string; // optional, last failure reason — useful for debugging stuck items
}

export interface MetaEntry {
  key: string; // primary key, e.g. "lastEmployeeSyncAt"
  value: string;
}

// ---------- Database ----------

class DB extends Dexie {
  employees!: EntityTable<CachedEmployee, "cardId">;
  pendingActions!: EntityTable<PendingAction, "clientEventId">;
  meta!: EntityTable<MetaEntry, "key">;

  constructor() {
    super("shift-db");

    this.version(2).stores({
      // cardId is the primary key (&cardId not needed since it's the PK, implicitly unique)
      employees: "cardId, lastAction, cachedAt",

      // clientEventId is the primary key.
      // Indexes:
      //  - syncStatus: to quickly query all non-synced rows for the badge + retry loop
      //  - cardId: to look up an employee's own pending history (for the duplicate-warning check)
      //  - occurredAt: to order the retry queue and pending-list display chronologically
      pendingActions: "clientEventId, syncStatus, cardId, occurredAt",

      // key-value store; currently just "lastEmployeeSyncAt"
      meta: "key",
    });
  }
}

export const db = new DB();
