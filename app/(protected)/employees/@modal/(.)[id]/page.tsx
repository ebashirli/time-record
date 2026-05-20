// app/employees/@modal/(.)[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditEmployeeModal() {
  const router = useRouter();
  const params = useParams();

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
          <DialogDescription>
            {
              "Make changes to the employee profile here. Click save when you're done."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Editing form for employee {params.id} goes here.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
