"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  children: React.ReactElement;
}

export function UserAddEditModal({ open, children }: Props) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) router.push("/users", { scroll: false });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-fit">{children}</DialogContent>
    </Dialog>
  );
}
