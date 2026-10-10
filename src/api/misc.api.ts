import { apiClient } from "@/lib/apiClient";
import type {
	AnalyticsOverview,
	AppNotification,
	Earning,
	EarningListQuery,
	MyEarnings,
	NotificationListQuery,
	PayoutResult,
	PriceQuote,
	PriceQuoteInput,
	Pricing,
	ShipmentsTrend,
	TopCourier,
	UpdatePricingInput,
} from "@/types/misc.type";

export const pricingApi = {
	get: () => apiClient<Pricing>("/pricing"),
	quote: (body: PriceQuoteInput) =>
		apiClient<PriceQuote>("/pricing/quote", { method: "POST", body }),
	update: (body: UpdatePricingInput) =>
		apiClient<Pricing>("/pricing", { method: "PUT", body }),
};

export const earningsApi = {
	mine: (query: { page?: number; limit?: number; status?: "PENDING" | "PAID" }) =>
		apiClient<MyEarnings>("/earnings/my", { query }),
	list: (query: EarningListQuery) => apiClient<Earning[]>("/earnings", { query }),
	payout: (courierId: string) =>
		apiClient<PayoutResult>("/earnings/payout", {
			method: "PATCH",
			body: { courierId },
		}),
};

export const notificationsApi = {
	list: (query: NotificationListQuery) =>
		apiClient<AppNotification[]>("/notifications", { query }),
	unreadCount: () =>
		apiClient<{ unreadCount: number }>("/notifications/unread-count"),
	markAllRead: () =>
		apiClient<{ updated: number }>("/notifications/read-all", {
			method: "PATCH",
		}),
	markRead: (id: string) =>
		apiClient<{ id: string }>(`/notifications/${id}/read`, { method: "PATCH" }),
};

export const analyticsApi = {
	overview: () => apiClient<AnalyticsOverview>("/analytics/overview"),
	trend: (days: number) =>
		apiClient<ShipmentsTrend>("/analytics/shipments-trend", { query: { days } }),
	topCouriers: (limit: number) =>
		apiClient<TopCourier[]>("/analytics/top-couriers", { query: { limit } }),
};
