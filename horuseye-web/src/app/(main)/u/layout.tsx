import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { AppSidebar } from "./_components/sidebar";
import { AppSidebarInset } from "./_components/navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar:state")?.value;
  const sidebarWidth = cookieStore.get("sidebar:width")?.value;
  let defaultOpen = true;
  if (sidebarState) {
    defaultOpen = sidebarState === "open";
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen} defaultWidth={sidebarWidth}>
      <AppSidebar>
        <AppSidebarInset>{children}</AppSidebarInset>
      </AppSidebar>
    </SidebarProvider>
  );
}
