"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  children: React.ReactElement;
}

export function EmployeeEditModal({ open, children }: Props) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) router.push("/employees", { scroll: false });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-fit">{children}</DialogContent>
    </Dialog>
  );
}
