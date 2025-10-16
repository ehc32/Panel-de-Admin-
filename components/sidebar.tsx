"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LayoutDashboard, BarChart3, User, ChevronRight, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

// 🧭 Navegación principal
const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Estadísticas",
    url: "/estadisticas",
    icon: BarChart3,
    badge: "Nuevo",
  },
  {
    title: "Mi Perfil",
    url: "/perfil",
    icon: User,
    badge: null,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.replace("/login")
  }

  // Cargar el usuario actual
  const [userEmail, setUserEmail] = useState<string | null>(null)
  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseBrowserClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUserEmail(session?.user?.email ?? null)
    }
    load()
  }, [])

  const initials = userEmail?.split("@")[0].slice(0, 2).toUpperCase() ?? "US"
  const displayName = userEmail ? userEmail.split("@")[0].replace(/\./g, " ") : "Administrador"

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      {/* HEADER */}
      <SidebarHeader className="px-3 py-4 bg-transparent">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden shadow-sm flex-shrink-0">
            <img
              src="/Icono.jpg"
              alt="Logo"
              className="h-full w-full object-cover"
            />
          </div>

          {!isCollapsed && (
            <>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-base font-bold leading-tight tracking-tight text-sidebar-foreground truncate">
                  Admin Panel
                </span>
                <span className="text-xs font-medium text-sidebar-foreground/60 truncate">Gestión de clientes</span>
              </div>

              {/* ModeToggle button in the header */}
              <div className="flex-shrink-0">
                <ModeToggle />
              </div>
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator className="my-1 bg-sidebar-border/50" />

      {/* CONTENIDO PRINCIPAL */}
      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
              Navegación
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className={cn("px-2", isCollapsed && "px-1")}>
            <SidebarMenu className="gap-0.5">
              {mainNavItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "group relative h-10 transition-all duration-200 rounded-md",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground",
                        isCollapsed && "justify-center px-0"
                      )}
                    >
                      <Link href={item.url} className={cn(
                        "flex items-center w-full",
                        isCollapsed ? "justify-center" : "gap-3"
                      )}>
                        <item.icon className={cn(
                          "flex-shrink-0",
                          isCollapsed ? "h-5 w-5" : "h-4 w-4"
                        )} />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 truncate text-sm">
                              {item.title}
                            </span>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-auto h-5 px-2 text-xs font-semibold">
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER / USUARIO */}
      <SidebarFooter className={cn(
        "mt-auto border-t border-sidebar-border/50",
        isCollapsed ? "p-1" : "p-2"
      )}>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={cn(
                    "group h-12 transition-all duration-200 hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent rounded-md",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Avatar className={cn(
                    "rounded-lg border border-sidebar-border/50",
                    isCollapsed ? "h-8 w-8" : "h-8 w-8"
                  )}>
                    <AvatarImage src="/diverse-user-avatars.png" alt="Usuario" />
                    <AvatarFallback className="rounded-lg bg-sidebar-accent text-xs font-semibold text-sidebar-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <>
                      <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                        <span className="truncate font-semibold text-sidebar-foreground text-sm">{displayName}</span>
                        <span className="truncate text-xs text-sidebar-foreground/60">{userEmail ?? ""}</span>
                      </div>
                      <ChevronRight className="ml-auto h-4 w-4 text-sidebar-foreground/60 transition-transform group-data-[state=open]:rotate-90 flex-shrink-0" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" side={isCollapsed ? "right" : "bottom"} sideOffset={8}>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userEmail ?? ""}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
