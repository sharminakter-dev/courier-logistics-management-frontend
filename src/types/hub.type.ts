import type { ShipmentStatus } from "./shipment.type";

export type Zone = {
	id: string;
	hubId: string;
	name: string;
	areas: string[];
	isActive: boolean;
};

export type Hub = {
	id: string;
	name: string;
	code: string;
	city: string;
	address: string;
	phone: string | null;
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
	zones?: Zone[];
	_count?: { zones?: number; couriers?: number };
};

export type CreateHubInput = {
	name: string;
	code: string;
	city: string;
	address: string;
	phone?: string;
};

export type HubListQuery = {
	page?: number;
	limit?: number;
	isActive?: boolean;
	city?: string;
};

export type TransferStatus = "IN_TRANSIT" | "RECEIVED";

export type HubTransfer = {
	id: string;
	shipmentId: string;
	status: TransferStatus;
	note: string | null;
	dispatchedAt: string;
	receivedAt: string | null;
	fromHub: { id: string; name: string; city: string };
	toHub: { id: string; name: string; city: string };
	shipment: { id: string; trackingNumber: string; status: ShipmentStatus };
};

export type TransferListQuery = {
	page?: number;
	limit?: number;
	status?: TransferStatus;
	fromHubId?: string;
	toHubId?: string;
	shipmentId?: string;
};
