import { createServerClient } from "@/lib/pocketbase/server";
import { AppSidebarUI } from "./ui";
import { NavItem } from "@/interfaces/nav-item";

export async function AppSidebar() {
  const pb = await createServerClient();

  const records = await pb.collection("navigation_routes").getFullList({
    sort: "-created",
  });

  const navItems: NavItem[] = records.map((record) => ({
    id: record.id,
    name: record.name,
    relative_route: record.relative_route,
    lucide_icon: record.lucide_icon,
  }));

  return <AppSidebarUI navItems={navItems} />;
}
