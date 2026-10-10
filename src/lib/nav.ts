import {
	ArrowLeftRight,
	BadgeDollarSign,
	Bell,
	Building2,
	ChartColumn,
	ClipboardList,
	CreditCard,
	LayoutDashboard,
	type LucideIcon,
	Package,
	PackagePlus,
	Truck,
	UserCircle,
	Wallet,
} from "lucide-react";
import type { Role } from "@/types/enums";

export interface NavItem {
	label: string;
	href: string;
	icon: LucideIcon;
	exact?: boolean;
}

const ADMIN_NAV: NavItem[] = [
	{ label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
	{ label: "Shipments", href: "/admin/shipments", icon: Package },
	{ label: "Couriers", href: "/admin/couriers", icon: Truck },
	{ label: "Hubs & Zones", href: "/admin/hubs", icon: Building2 },
	{ label: "Transfers", href: "/admin/transfers", icon: ArrowLeftRight },
	{ label: "Pricing", href: "/admin/pricing", icon: BadgeDollarSign },
	{ label: "Reports", href: "/admin/reports", icon: ChartColumn },
	{ label: "Notifications", href: "/admin/notifications", icon: Bell },
	{ label: "Profile", href: "/admin/profile", icon: UserCircle },
];

	
export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
	CUSTOMER: [
		{ label: "My Shipments", href: "/dashboard", icon: Package, exact: true },
		{ label: "New Shipment", href: "/dashboard/shipments/new", icon: PackagePlus },
		{ label: "Payments", href: "/dashboard/payments", icon: CreditCard },
		{ label: "Notifications", href: "/dashboard/notifications", icon: Bell },
		{ label: "Profile", href: "/dashboard/profile", icon: UserCircle },
	],
	COURIER: [
		{ label: "My Tasks", href: "/courier", icon: ClipboardList, exact: true },
		{ label: "Earnings", href: "/courier/earnings", icon: Wallet },
		{ label: "Notifications", href: "/courier/notifications", icon: Bell },
		{ label: "Profile", href: "/courier/profile", icon: UserCircle },
	],
	SUPER_ADMIN: ADMIN_NAV,
	ADMIN: ADMIN_NAV,
};