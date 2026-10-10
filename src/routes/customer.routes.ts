import { Bell, LayoutDashboard, Package, PackagePlus } from "lucide-react";
import type { NavGroup } from "@/types/sidebar.type";

export const customerRoutes: NavGroup[] = [
	{
		items: [
			{ title: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
			{ title: "New shipment", href: "/dashboard/new-shipment", icon: PackagePlus },
			{ title: "My shipments", href: "/dashboard/my-shipments", icon: Package },
			{ title: "Notifications", href: "/dashboard/notifications", icon: Bell },
		],
	},
];
