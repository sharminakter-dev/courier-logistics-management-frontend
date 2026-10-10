import { apiClient } from "@/lib/apiClient";
import type {
	CreateHubInput,
	Hub,
	HubListQuery,
	HubTransfer,
	TransferListQuery,
	Zone,
} from "@/types/hub.type";

export const hubsApi = {
	list: (query: HubListQuery) => apiClient<Hub[]>("/hubs", { query }),
	get: (id: string) => apiClient<Hub>(`/hubs/${id}`),
	create: (body: CreateHubInput) =>
		apiClient<Hub>("/hubs", { method: "POST", body }),
	update: (id: string, body: Partial<CreateHubInput> & { isActive?: boolean }) =>
		apiClient<Hub>(`/hubs/${id}`, { method: "PATCH", body }),
	deactivate: (id: string) => apiClient<Hub>(`/hubs/${id}`, { method: "DELETE" }),
	createZone: (hubId: string, body: { name: string; areas: string[] }) =>
		apiClient<Zone>(`/hubs/${hubId}/zones`, { method: "POST", body }),
	updateZone: (
		zoneId: string,
		body: { name?: string; areas?: string[]; isActive?: boolean },
	) => apiClient<Zone>(`/zones/${zoneId}`, { method: "PATCH", body }),
	deleteZone: (zoneId: string) =>
		apiClient<{ id: string }>(`/zones/${zoneId}`, { method: "DELETE" }),
};

export const transfersApi = {
	list: (query: TransferListQuery) =>
		apiClient<HubTransfer[]>("/hub-transfers", { query }),
	dispatch: (body: {
		shipmentId: string;
		fromHubId: string;
		toHubId: string;
		note?: string;
	}) => apiClient<HubTransfer>("/hub-transfers", { method: "POST", body }),
	receive: (id: string, note?: string) =>
		apiClient<HubTransfer>(`/hub-transfers/${id}/receive`, {
			method: "PATCH",
			body: note ? { note } : {},
		}),
};
