// app/employees/@modal/(.)[id]/page.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditEmployeeModal({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit Employee #{params.id}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Editing form for employee {params.id} goes here.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
