export const VEHICLE_TYPES = ["BICYCLE", "MOTORBIKE", "VAN", "TRUCK"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export type Courier = {
	id: string;
	userId: string;
	vehicleType: VehicleType;
	isAvailable: boolean;
	isApproved: boolean;
	hubId: string | null;
	user: {
		id: string;
		name: string;
		email: string;
		phone: string | null;
		status: string;
	};
	hub: { id: string; name: string; city: string } | null;
};

export type CourierProfile = {
	id: string;
	vehicleType: VehicleType;
	isAvailable: boolean;
	isApproved: boolean;
	user: { name: string; email: string; phone: string | null; status: string };
	hub: { id: string; name: string } | null;
	stats: { delivered: number; active: number };
};

export type CourierListQuery = {
	page?: number;
	limit?: number;
	isAvailable?: boolean;
	isApproved?: boolean;
	hubId?: string;
	searchTerm?: string;
};

export type CreateCourierInput = {
	name: string;
	email: string;
	password: string;
	phone: string;
	vehicleType: VehicleType;
	hubId?: string;
};

export type RegisterCourierInput = Omit<CreateCourierInput, "hubId">;

export type UpdateCourierInput = {
	isApproved?: boolean;
	hubId?: string | null;
	vehicleType?: VehicleType;
	isAvailable?: boolean;
	status?: "ACTIVE" | "BLOCKED";
};
