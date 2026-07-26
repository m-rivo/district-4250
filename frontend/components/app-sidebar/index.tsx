import { createServerClient } from "@/lib/pocketbase/server";
import { AppSidebarUI } from "./ui";
import { NavItem } from "@/interfaces/nav-item";

export async function AppSidebar() {
  let navItems: NavItem[] = [];

  try {
    const pb = await createServerClient();

    const records = await pb.collection("navigation_routes").getFullList({
      sort: "order",
    });

    navItems = records.map((record) => ({
      id: record.id,
      name: record.name,
      relative_route: record.relative_route,
      lucide_icon: record.lucide_icon,
    }));
  } catch (error) {
    console.error(error);
  }

  return <AppSidebarUI navItems={navItems} />;
}
