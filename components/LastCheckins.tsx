import prisma from "@/lib/prisma";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

const LastCheckins = async () => {
  const checkins = await prisma.checkin.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      employee: { select: { name: true } },
    },
  });

  return (
    <Dialog>
      {checkins.map((checkin) => (
        <DialogTrigger asChild key={checkin.id}>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={checkin.employee.name}>
              <Button variant="ghost" className="w-full justify-start">
                {checkin.employee.name}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </DialogTrigger>
      ))}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sticky Footer</DialogTitle>
          <DialogDescription>
            This dialog has a sticky footer that stays visible while the content
            scrolls.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LastCheckins;
