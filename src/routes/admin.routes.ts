import {
	Banknote,
	Bell,
	Building2,
	LayoutDashboard,
	Package,
	Repeat,
	Tag,
	Users,
} from "lucide-react";
import type { NavGroup } from "@/types/sidebar.type";

export const adminRoutes: NavGroup[] = [
	{
		items: [
			{ title: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
			{ title: "Shipments", href: "/admin/shipments", icon: Package },
			{ title: "Hub transfers", href: "/admin/transfers", icon: Repeat },
		],
	},
	{
		label: "Management",
		items: [
			{ title: "Hubs & zones", href: "/admin/hubs", icon: Building2 },
			{ title: "Couriers", href: "/admin/couriers", icon: Users },
			{ title: "Pricing", href: "/admin/pricing", icon: Tag },
			{ title: "Earnings", href: "/admin/earnings", icon: Banknote },
			{ title: "Notifications", href: "/admin/notifications", icon: Bell },
		],
	},
];
