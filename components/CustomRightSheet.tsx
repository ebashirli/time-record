"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ListIcon } from "lucide-react";

export function CustomRightSheet({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <Sheet>
      <SheetTrigger className="" asChild>
        <Button variant="outline">
          <ListIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"right"}
        className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
      >
        <SheetHeader>
          <SheetTitle>Checkin list</SheetTitle>
          <SheetDescription>See last chekins here</SheetDescription>
        </SheetHeader>
        <div className="no-scrollbar overflow-y-auto px-4">{children}</div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
