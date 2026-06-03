"use client";
import { Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useTransition } from "react";
import { toast } from "sonner";

interface I {
  id: string;
}

type Props<T extends I> = {
  setData: Dispatch<SetStateAction<T[]>>;
  id: string;
  deleteAction: (id: string) => Promise<{
    success: boolean;
    error?: string;
    data?: { name: string | null; id: string | null };
  }>;
};

export function DeleteDialog<T extends I>({
  deleteAction,
  id,
  setData,
}: Props<T>) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const { success, error, data: { name } = {} } = await deleteAction(id);
      if (success) {
        toast.success(`${name} deleted successfully`);
        setData((prev: T[]) => prev.filter((d) => d.id !== id));
      } else toast.error(error);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"} className="cursor-pointer" size="icon">
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete employee?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete this employee.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
