import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  // SidebarSeparator,
} from "@/components/ui/sidebar";

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-[svh-var(--header-height)] border-l lg:flex"
      {...props}
    >
      <SidebarContent>{props.children}</SidebarContent>
    </Sidebar>
  );
}
