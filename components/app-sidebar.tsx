"use client";

import * as React from "react";

import { NavSection } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
// import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  CameraIcon,
  ChartBarIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  LayoutDashboardIcon,
  UsersIcon,
  Settings2Icon,
  CommandIcon,
  Building2Icon,
} from "lucide-react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Companies",
      url: "/companies",
      icon: <Building2Icon />,
    },
    {
      title: "Employees",
      url: "/employees",
      icon: <UsersIcon />,
    },
    {
      title: "Attendance Tracking System",
      url: "#",
      icon: <ChartBarIcon />,
    },
    {
      title: "Time Sheet",
      url: "#",
      icon: <FolderIcon />,
    },
    {
      title: "Personnel Movements",
      url: "#",
      icon: <ChartBarIcon />,
    },
    {
      title: "Leave Management",
      url: "#",
      icon: <ChartBarIcon />,
    },
    {
      title: "Entry/Exit Records",
      url: "#",
      icon: <FolderIcon />,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: <CameraIcon />,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],

  configurations: [
    {
      name: "Shift Planning",
      url: "#",
      icon: <DatabaseIcon />,
    },
    {
      name: "Departments",
      url: "#",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "Public Holidays",
      url: "#",
      icon: <FileIcon />,
    },
    {
      name: "Terminal Management",
      url: "#",
      icon: <FileIcon />,
    },
    {
      name: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
  ],
  tools: [
    {
      name: "Strategic Reports",
      url: "#",
      icon: <DatabaseIcon />,
    },
    {
      name: "Personnel Details Table",
      url: "#",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "Announcements",
      url: "#",
      icon: <FileIcon />,
    },
    {
      name: "Bulk Personnel Import",
      url: "/bulk-personnel-import",
      icon: <FileIcon />,
    },
    {
      name: "Working Hours",
      url: "#",
      icon: <FileIcon />,
    },
    {
      name: "Security Records",
      url: "#",
      icon: <FileIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSection items={data.configurations} />
        <NavSection items={data.tools} name="Tools" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
