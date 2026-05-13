"use client";

import { SearchForm } from "@/components/search-form";
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
import { HomeIcon, PanelLeftIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const pathParts = pathname
    .split("?")
    .at(0)
    ?.split("/")
    .filter((e) => !!e);

  console.log({ pathParts });

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
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
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <HomeIcon size={18} />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {pathParts?.map((part) => (
              <BreadcrumbItem key={part}>
                <BreadcrumbPage>
                  {part.at(0)?.toLocaleUpperCase() + part.slice(1)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        {/* <SearchForm className="w-full sm:ml-auto sm:w-auto" /> */}
      </div>
    </header>
  );
}
