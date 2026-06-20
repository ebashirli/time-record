"use client";

import { Button } from "@/components/ui/button";
// import Link from "next/link";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { notFound, useRouter } from "next/navigation";
// import { Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card } from "@/components/ui/card";
import { User } from "./types";
import dayjs from "dayjs";

interface Props {
  user: User | null;
}

export function UserDetailsModal({ user }: Props) {
  if (!user) notFound();

  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) router.push("/users", { scroll: false });
  };

  return (
    <Dialog open={!!user} onOpenChange={handleOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            {/* This dialog has a sticky footer that stays visible while the content scrolls. */}
          </DialogDescription>
          {/* Header with Image and Basic Info */}
          <div className="flex  gap-6  mb-4">
            {user.image && (
              <Avatar className="h-48 w-48 rounded-lg">
                {user.image && (
                  <AvatarImage
                    src={"/api/images/" + user.image}
                    alt={"profile image" + (user.name ?? "")}
                  />
                )}
                <AvatarFallback className="rounded-lg">
                  {user.name?.slice(0, 2).toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 text-sm ">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Role</p>
            <p className="font-medium">{user.role}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Created at</p>
            <p className="font-medium">
              {dayjs(user.createdAt).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          {/* <Button asChild type="button">
            <Link href={`/users/${user.id}/edit`}>
              <Edit />
              Edit
            </Link>
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
