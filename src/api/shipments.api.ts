import { apiClient } from "@/lib/apiClient";
import type {
	CreateShipmentInput,
	CreateShipmentResult,
	Shipment,
	ShipmentListItem,
	ShipmentListQuery,
	ShipmentStatus,
	TrackingResult,
	UpdatableStatus,
} from "@/types/shipment.type";

export const shipmentsApi = {
	create: (body: CreateShipmentInput) =>
		apiClient<CreateShipmentResult>("/shipments", { method: "POST", body }),
	pay: (id: string) =>
		apiClient<{ paymentUrl: string }>(`/shipments/${id}/pay`, {
			method: "POST",
		}),
	cancel: (id: string, reason?: string) =>
		apiClient<{ id: string; trackingNumber: string; status: ShipmentStatus }>(
			`/shipments/${id}/cancel`,
			{ method: "PATCH", body: reason ? { reason } : {} },
		),
	track: (trackingNumber: string) =>
		apiClient<TrackingResult>(
			`/shipments/track/${encodeURIComponent(trackingNumber)}`,
		),
	mine: (query: ShipmentListQuery) =>
		apiClient<ShipmentListItem[]>("/shipments/my-shipments", { query }),
	list: (query: ShipmentListQuery) =>
		apiClient<ShipmentListItem[]>("/shipments", { query }),
	get: (id: string) => apiClient<Shipment>(`/shipments/${id}`),
	assignCourier: (id: string, courierId: string) =>
		apiClient<{ id: string; status: ShipmentStatus; courierId: string }>(
			`/shipments/${id}/assign-courier`,
			{ method: "PATCH", body: { courierId } },
		),
	updateStatus: (
		id: string,
		body: { status: UpdatableStatus; note?: string; location?: string },
	) =>
		apiClient<{ id: string; status: ShipmentStatus; deliveryAttempts: number }>(
			`/shipments/${id}/status`,
			{ method: "PATCH", body },
		),
};
