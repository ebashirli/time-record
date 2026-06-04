"use client";

import React from "react";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Settings } from "lucide-react";
import { UserSettings } from "./UserSettings";

export const TerminalUserSettings = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Settings />
      </DropdownMenuTrigger>
      <UserSettings />
    </DropdownMenu>
  );
};
