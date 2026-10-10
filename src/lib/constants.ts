import type { Role } from "@/types/enums";

export const ROLE_HOME: Record<Role, string> = {
	SUPER_ADMIN: "/admin",
	ADMIN: "/admin",
	COURIER: "/courier",
	CUSTOMER: "/dashboard",
};

export interface DemoAccount {
	role: Role;
	label: string;
	description: string;
	email: string;
	password: string;
}

// must match the seeded accounts in the backend .env
export const DEMO_ACCOUNTS: DemoAccount[] = [
	{
		role: "SUPER_ADMIN",
		label: "Super Admin",
		description: "Full platform control",
		email: "superadmin@courier.com",
		password: "SuperAdmin@12345",
	},
	{
		role: "ADMIN",
		label: "Admin",
		description: "Manage shipments, hubs and couriers",
		email: "admin@courier.com",
		password: "Admin@12345",
	},
	{
		role: "CUSTOMER",
		label: "Customer",
		description: "Create, pay for and track parcels",
		email: "customer@courier.com",
		password: "Customer@12345",
	},
	{
		role: "COURIER",
		label: "Courier",
		description: "Pick up and deliver assigned parcels",
		email: "courier@courier.com",
		password: "Courier@12345",
	},
];

export const SITE_NAME = "Courier & Logistics";

export const NAV_LINKS = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/about" },
	{ label: "Services", href: "/services" },
	{ label: "Pricing", href: "/pricing" },
	{ label: "Contact", href: "/contact" },
	{ label: "Track Parcel", href: "/track" },
] as const;