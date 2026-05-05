"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { HomeIcon, Link, PanelLeftIcon, QrCode } from "lucide-react";
import React from "react";

import { usePathname } from "next/navigation";

export function SiteHeader({ children }: { children: React.ReactElement }) {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full  items-center justify-between  gap-2 px-4">
        <div className="flex items-center ">
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <PanelLeftIcon />
          </Button>
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
        </div>
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Button className="h-10 w-10" variant="ghost" size="icon" asChild>
                <BreadcrumbLink href="/">
                  <HomeIcon size={8} />
                </BreadcrumbLink>
              </Button>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {pathname === "/scanner" ? (
          children
        ) : (
          <Button asChild variant="ghost" size="icon">
            <Link href="/scanner">
              <QrCode />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
