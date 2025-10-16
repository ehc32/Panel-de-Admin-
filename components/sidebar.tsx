"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LayoutDashboard, BarChart3, User, ChevronRight, LogOut } from "lucide-react"

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
      const { data: { session } } = await supabase.auth.getSession()
      setUserEmail(session?.user?.email ?? null)
    }
    load()
  }, [])

  const initials = (userEmail?.split("@")[0].slice(0, 2).toUpperCase() ?? "US")
  const displayName = userEmail ? userEmail.split("@")[0].replace(/\./g, " ") : "Administrador"

  return (
    <Sidebar
      collapsible="icon"
      className="border-none bg-white shadow-sm rounded-r-xl"
    >
      {/* HEADER */}
      <SidebarHeader className="px-4 py-6 bg-transparent">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-sm">
            <img
              src="/Icono.jpg" // ⚠️ coloca aquí el nombre real de tu logo (por ejemplo: /logo.png)
              alt="Logo"
              className="h-full w-full object-cover"
            />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight tracking-tight text-foreground">
                Admin Panel
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                Gestión de clientes
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator className="my-2 bg-transparent" />

      {/* CONTENIDO PRINCIPAL */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Navegación Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="gap-1">
              {mainNavItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="group relative h-11 transition-all duration-200 hover:bg-accent/50 rounded-lg"
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        {isActive && (
                          <div className="absolute left-0 h-8 w-1 rounded-r-full bg-primary shadow-sm shadow-primary/50" />
                        )}
                        <item.icon
                          className={`h-5 w-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
                        />
                        <span
                          className={`font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                        >
                          {item.title}
                        </span>
                        {item.badge && !isCollapsed && (
                          <Badge variant="secondary" className="ml-auto h-5 px-2 text-xs font-semibold shadow-sm">
                            {item.badge}
                          </Badge>
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
      <SidebarFooter className="mt-auto p-2 border-t border-muted/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="group h-14 transition-all duration-200 hover:bg-accent/50 data-[state=open]:bg-accent rounded-lg"
                >
                  <Avatar className="h-9 w-9 rounded-xl border-2 border-primary/10 shadow-sm">
                    <AvatarImage src="/diverse-user-avatars.png" alt="Usuario" />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-semibold text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold text-foreground">{displayName}</span>
                        <span className="truncate text-xs text-muted-foreground">{userEmail ?? ""}</span>
                      </div>
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
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
