import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
// import { getServerSession, isTerminalRole } from "@/lib/auth-session";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getServerSession();
  const isTerminal = false;
  // isTerminalRole(session?.user.role);

  if (isTerminal) {
    return (
      <div className="flex min-h-svh flex-col bg-background">{children}</div>
    );
  }

  return (
    <SidebarProvider
      className="flex flex-col"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SiteHeader />
      <div className="flex flex-1">
        <AppSidebar variant="inset" />
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
