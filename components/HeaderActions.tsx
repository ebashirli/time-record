"use client";

import { Button } from "./ui/button";
import { QrCode } from "lucide-react";
import Link from "next/link";
import { CustomDrawer } from "./CustomDrawer";
import { usePathname } from "next/navigation";

const HeaderActions = () => {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/scanner" ? (
        <CustomDrawer />
      ) : (
        <Button asChild variant="ghost" size="icon">
          <Link href="/scanner">
            <QrCode />
          </Link>
        </Button>
      )}
    </>
  );
};

export default HeaderActions;
