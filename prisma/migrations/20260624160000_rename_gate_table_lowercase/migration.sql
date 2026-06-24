-- RenameTable
ALTER TABLE "Gate" RENAME TO "gate";

-- RenameConstraint
ALTER TABLE "gate" RENAME CONSTRAINT "Gate_pkey" TO "gate_pkey";
