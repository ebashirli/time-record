"use client";

// import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { QrCodeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
}) {
  const pathname = usePathname();
  const pathParts = pathname
    .split("?")
    .at(0)
    ?.split("/")
    .filter((e) => !!e);

  const firstPart = pathParts?.at(0);

  function handleClick(url?: string) {
    if (url === "#") {
      toast.dismiss();
      toast.info("Soon. Under construction 🚧", { position: "bottom-left" });
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              disabled={pathname === "/scanner"}
              asChild
              tooltip="Scan new QR Code"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground "
            >
              <Link
                href={pathname === "/scanner" ? "" : "/scanner"}
                className=""
              >
                <QrCodeIcon className="" />
                <span>Scan QR</span>
              </Link>
            </SidebarMenuButton>
            {/* <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button> */}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={`/${firstPart}` === item.url}
                asChild
                tooltip={item.title}
                onClick={() => handleClick(item.url)}
              >
                <Link href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
