"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { EllipsisVerticalIcon } from "lucide-react";

import { UserSettings } from "./UserSettings";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { Badge } from "./ui/badge";
import { getGateById } from "@/actions/gates";

export function NavUser() {
  const { session, user } = useCurrentSession();
  const { isMobile } = useSidebar();
  const [gateName, setGateName] = useState<string | null>(null);

  useEffect(() => {
    const promise = user?.gateId
      ? getGateById(user.gateId)
      : Promise.resolve(null);
    promise.then((name) => setGateName(name));
  }, [user?.gateId]);

  if (!session || !user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="min-h-18">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                {user.image && (
                  <AvatarImage
                    src={"/external-images/" + user.image}
                    alt={user.name}
                  />
                )}
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex w-full justify-between">
                  <span className="truncate font-medium">{user.name}</span>
                  <Badge>
                    <span className="truncate font-medium">{user.role}</span>
                  </Badge>
                </div>
                <div className="flex w-full justify-between">
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <div className="flex w-full justify-between">
                  {gateName && (
                    <span className="truncate text-xs text-muted-foreground">
                      {gateName}
                    </span>
                  )}
                </div>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <UserSettings isMobile={isMobile} />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
