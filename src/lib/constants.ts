import type { Role } from "@/types/enums";

export const ROLE_HOME: Record<Role, string> = {
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