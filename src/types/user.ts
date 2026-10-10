import type { Role, VehicleType } from "./enums";

export interface User {
	id: string;
	name: string;
	email: string;
	phone: string | null;
	role: Role;
	status: "ACTIVE" | "BLOCKED" | "DELETED";
	emailVerified: boolean;
	createdAt: string;
}

export interface CustomerProfile {
	id: string;
	userId: string;
	address: string | null;
}

export interface CourierProfile {
	id: string;
	userId: string;
	vehicleType: VehicleType | null;
	isAvailable: boolean;
	isApproved: boolean;
	hubId: string | null;
}

export interface Me extends User {
	customer: CustomerProfile | null;
	courier: CourierProfile | null;
}