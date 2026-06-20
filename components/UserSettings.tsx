"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Moon, Sun } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useSession } from "@/lib/auth-client";
import { Badge } from "./ui/badge";

export const UserSettings = ({ isMobile }: { isMobile?: boolean }) => {
  const session = useSession();
  const user = session?.data?.user;
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      side={isMobile ? "bottom" : "right"}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            {user?.image && (
              <AvatarImage
                src={"/external-images/" + user.image}
                alt={user.name}
              />
            )}
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight py-2">
            <div className="flex justify-between">
              <span className="truncate font-medium">{user?.name}</span>
              <Badge>
                <span className="truncate font-medium">{user?.role}</span>
              </Badge>
            </div>
            <span className="truncate text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-6"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
        </div>
      </DropdownMenuLabel>
      {/* <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <CircleUserRoundIcon />
          Account
        </DropdownMenuItem>
      </DropdownMenuGroup> */}
      <DropdownMenuSeparator />
      <LogoutButton />
    </DropdownMenuContent>
  );
};
