"use client";

import { useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/routing";
import {
  LogOut,
  LayoutDashboard,
  User,
  Folder,
  Users,
  Settings,
  FileUser,
} from "lucide-react";
import { NavItem } from "@/interfaces/nav-item";
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
import { logoutAction } from "@/app/actions/auth";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  User,
  Folder,
  Users,
  FileUser,
  Settings,
};

export function AppSidebarUI({ navItems }: { navItems: NavItem[] }) {
  const t = useTranslations("Navigation");
  const pathname = usePathname();

  return (
    <Sidebar variant="floating" collapsible="icon">
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

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("menu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.relative_route;
                const IconComponent = item.lucide_icon
                  ? ICON_MAP[item.lucide_icon] || LayoutDashboard
                  : LayoutDashboard;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={t(item.name)}
                    >
                      <Link href={"/" + item.relative_route}>
                        <IconComponent className="h-4 w-4" />
                        <span>{t(item.name)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2 border-t">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:flex-col gap-2">
          <ThemeModeToggle />
          <LanguageToggle />
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logoutAction()}
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
