import { Banknote, Bell, LayoutDashboard, Package } from "lucide-react";
import type { NavGroup } from "@/types/sidebar.type";

export const courierRoutes: NavGroup[] = [
	{
		items: [
			{ title: "Profile", href: "/courier", icon: LayoutDashboard, exact: true },
			{ title: "My deliveries", href: "/courier/shipments", icon: Package },
			{ title: "Earnings", href: "/courier/earnings", icon: Banknote },
			{ title: "Notifications", href: "/courier/notifications", icon: Bell },
		],
	},
];
