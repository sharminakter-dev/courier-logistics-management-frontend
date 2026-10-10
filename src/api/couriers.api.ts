import { apiClient } from "@/lib/apiClient";
import type {
	Courier,
	CourierListQuery,
	CourierProfile,
	CreateCourierInput,
	RegisterCourierInput,
	UpdateCourierInput,
} from "@/types/courier.type";
import type { CourierShipment, ShipmentStatus } from "@/types/shipment.type";

export const couriersApi = {
	register: (body: RegisterCourierInput) =>
		apiClient<{ id: string; email: string }>("/couriers/register", {
			method: "POST",
			body,
		}),
	create: (body: CreateCourierInput) =>
		apiClient<{ id: string }>("/couriers", { method: "POST", body }),
	list: (query: CourierListQuery) => apiClient<Courier[]>("/couriers", { query }),
	update: (id: string, body: UpdateCourierInput) =>
		apiClient<Courier>(`/couriers/${id}`, { method: "PATCH", body }),
	me: () => apiClient<CourierProfile>("/couriers/me"),
	myShipments: (query: { page?: number; limit?: number; status?: ShipmentStatus }) =>
		apiClient<CourierShipment[]>("/couriers/me/shipments", { query }),
	setAvailability: (isAvailable: boolean) =>
		apiClient<{ id: string; isAvailable: boolean }>("/couriers/me/availability", {
			method: "PATCH",
			body: { isAvailable },
		}),
};
