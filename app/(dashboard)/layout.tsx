import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protección adicional: si no hay sesión, redirigir al login
  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <main className="flex-1 min-w-0 overflow-auto">
          <div className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="h-8 w-8" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-foreground">Panel de Administración</h1>
            </div>
            <div className="flex-1" />
          </div>
          <div className="container mx-auto p-4 lg:p-6 max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
