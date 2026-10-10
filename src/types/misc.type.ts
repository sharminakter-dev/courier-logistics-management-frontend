import type { ShipmentStatus } from "./shipment.type";

export type Pricing = {
	id: string;
	sameCityBase: string;
	interCityBase: string;
	freeWeightKg: string;
	perExtraKg: string;
	expressMultiplier: string;
	isActive: boolean;
	createdAt: string;
};

export type UpdatePricingInput = {
	sameCityBase?: number;
	interCityBase?: number;
	freeWeightKg?: number;
	perExtraKg?: number;
	expressMultiplier?: number;
};

export type PriceQuoteInput = {
	pickupCity: string;
	receiverCity: string;
	weightKg: number;
	deliveryType: "STANDARD" | "EXPRESS";
};

export type PriceQuote = {
	base: number;
	extraKg: number;
	extraCharge: number;
	subtotal: number;
	multiplier: number;
	total: number;
};

export type EarningStatus = "PENDING" | "PAID";

export type Earning = {
	id: string;
	courierId: string;
	shipmentId: string;
	amount: string;
	status: EarningStatus;
	paidAt: string | null;
	createdAt: string;
	shipment: { trackingNumber: string; deliveredAt: string | null };
	courier?: { user: { name: string } };
};

export type MyEarnings = {
	summary: { pending: number; paid: number; total: number };
	earnings: Earning[];
};

export type EarningListQuery = {
	page?: number;
	limit?: number;
	courierId?: string;
	status?: EarningStatus;
};

export type PayoutResult = {
	courierId: string;
	count: number;
	totalPaid: number;
};

export type AppNotification = {
	id: string;
	userId: string;
	title: string;
	message: string;
	shipmentId: string | null;
	isRead: boolean;
	createdAt: string;
};

export type NotificationListQuery = {
	page?: number;
	limit?: number;
	isRead?: boolean;
};

export type AnalyticsOverview = {
	shipments: {
		total: number;
		today: number;
		byStatus: Record<ShipmentStatus, number>;
		deliverySuccessRate: number;
	};
	revenue: { total: number; refunded: number };
	couriers: { total: number; available: number; pendingEarnings: number };
	customers: { total: number };
	hubs: { active: number };
};

export type TrendPoint = { date: string; shipments: number; revenue: number };

export type ShipmentsTrend = { days: number; trend: TrendPoint[] };

export type TopCourier = { courierId: string; name: string; delivered: number };
