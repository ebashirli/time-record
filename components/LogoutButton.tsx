import { LogOutIcon } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const LogoutButton = () => {
  return (
    <DropdownMenuItem
      onClick={async () => {
        const res = await signOut();
        if (res?.data?.success) redirect("/sign-in");
      }}
    >
      <LogOutIcon />
      Log out
    </DropdownMenuItem>
  );
};

export default LogoutButton;
