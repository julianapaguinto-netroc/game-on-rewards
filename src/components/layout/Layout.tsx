import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
      <SidebarProvider>
        <header className="h-12 flex items-center border-b bg-background z-50 fixed top-0 left-0 right-0">
          <SidebarTrigger className="ml-2">
            <Menu className="h-4 w-4" />
          </SidebarTrigger>
          <h1 className="ml-4 font-semibold">Marketplace</h1>
        </header>

        <div className="flex min-h-screen w-full pt-12">
          <AppSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </SidebarProvider>
  );
}
