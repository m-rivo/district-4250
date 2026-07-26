"use client";

import { LayoutDashboard, User, LogOut, Settings, Folder } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/routing";

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
} from "@/components/ui/sidebar";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();

  // Lista de enlaces principales
  const navItems = [
    {
      title: t("dashboard"),
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t("profile"),
      url: "/profile",
      icon: User,
    },
    {
      title: t("projects"),
      url: "/projects",
      icon: Folder,
    },
  ];

  const handleLogout = () => {
    // Aquí agregas la lógica para cerrar sesión (ej. supabase.auth.signOut(), next-auth, etc.)
    console.log("Logging out...");
  };

  return (
    <Sidebar variant="floating" collapsible="icon">
      {/* Header del Sidebar */}
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            D
          </div>
          <span className="truncate group-data-[collapsible=icon]:hidden">
            District 4250
          </span>
        </div>
      </SidebarHeader>

      {/* Contenido / Menú Principal */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("menu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton isActive={isActive} tooltip={item.title}>
                      <Link href={item.url} className="flex gap-2 items-center">
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer del Sidebar: Toggles y Logout */}
      <SidebarFooter className="p-3 space-y-2 border-t">
        {/* Controles de Idioma y Tema */}
        <div className="flex items-center justify-between group-data-[collapsible=icon]:flex-col gap-2">
          <ThemeModeToggle />
          <LanguageToggle />
        </div>

        {/* Botón de Logout */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              tooltip={t("logout")}
            >
              <LogOut className="h-4 w-4" />
              <span>{t("logout")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
