import { LogOutIcon } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const LogoutButton = () => {
  return (
    <DropdownMenuItem
      onClick={async () => {
        const res = await authClient.signOut();
        if (res?.data?.success) redirect("/login");
      }}
    >
      <LogOutIcon />
      Log out
    </DropdownMenuItem>
  );
};

export default LogoutButton;
