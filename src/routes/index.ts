import type { NavGroup } from "@/types/sidebar.type";
import type { Role } from "@/types/auth.type";
import { adminRoutes } from "./admin.routes";
import { courierRoutes } from "./courier.routes";
import { customerRoutes } from "./customer.routes";

export function homeForRole(role: Role): string {
	if (role === "SUPER_ADMIN" || role === "ADMIN") return "/admin";
	if (role === "COURIER") return "/courier";
	return "/dashboard";
}

export function navForRole(role: Role): NavGroup[] {
	if (role === "SUPER_ADMIN" || role === "ADMIN") return adminRoutes;
	if (role === "COURIER") return courierRoutes;
	return customerRoutes;
}

export function shipmentPathForRole(role: Role, id: string): string | null {
	if (role === "SUPER_ADMIN" || role === "ADMIN") return `/admin/shipments/${id}`;
	if (role === "CUSTOMER") return `/dashboard/my-shipments/${id}`;
	return null;
}
