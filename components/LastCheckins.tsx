import prisma from "@/lib/prisma";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import Link from "next/link";

const LastCheckins = async () => {
  const checkins = await prisma.checkin.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    include: {
      employee: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <>
      {checkins.map((checkin) => (
        <SidebarMenuItem key={checkin.id}>
          <SidebarMenuButton asChild tooltip={checkin.employee.name}>
            <Link href={"#"}>{checkin.employee.name}</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};

export default LastCheckins;
