export const SHIPMENT_STATUSES = [
	"PENDING_PAYMENT",
	"PICKUP_REQUESTED",
	"COURIER_ASSIGNED",
	"PICKED_UP",
	"AT_ORIGIN_HUB",
	"IN_TRANSIT",
	"AT_DESTINATION_HUB",
	"OUT_FOR_DELIVERY",
	"DELIVERED",
	"DELIVERY_FAILED",
	"RETURNING",
	"RETURNED",
	"CANCELLED",
] as const;
export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export const UPDATABLE_STATUSES = [
	"PICKED_UP",
	"AT_ORIGIN_HUB",
	"OUT_FOR_DELIVERY",
	"DELIVERED",
	"DELIVERY_FAILED",
	"RETURNING",
	"RETURNED",
] as const;
export type UpdatableStatus = (typeof UPDATABLE_STATUSES)[number];

export const DELIVERY_TYPES = ["STANDARD", "EXPRESS"] as const;
export type DeliveryType = (typeof DELIVERY_TYPES)[number];

export type PaymentStatus =
	| "PENDING"
	| "PAID"
	| "FAILED"
	| "CANCELLED"
	| "REFUNDED";

export type TrackingEvent = {
	status: ShipmentStatus;
	note: string | null;
	location: string | null;
	createdAt: string;
};

export type Payment = {
	id?: string;
	status: PaymentStatus;
	amount: string;
	bkashPaymentId?: string | null;
	bkashTrxId?: string | null;
	paidAt?: string | null;
};

export type Shipment = {
	id: string;
	trackingNumber: string;
	customerId: string;
	courierId: string | null;
	status: ShipmentStatus;
	deliveryType: DeliveryType;
	pickupName: string;
	pickupPhone: string;
	pickupAddress: string;
	pickupCity: string;
	pickupScheduledAt: string | null;
	receiverName: string;
	receiverPhone: string;
	receiverAddress: string;
	receiverCity: string;
	parcelDescription: string | null;
	weightKg: string;
	price: string;
	deliveryAttempts: number;
	deliveredAt: string | null;
	createdAt: string;
	updatedAt: string;
	payment?: Payment | null;
	trackingEvents?: TrackingEvent[];
};

export type ShipmentListItem = {
	id: string;
	trackingNumber: string;
	status: ShipmentStatus;
	deliveryType: DeliveryType;
	pickupCity: string;
	receiverName: string;
	receiverCity: string;
	weightKg: string;
	price: string;
	createdAt: string;
	payment?: { status: PaymentStatus; amount: string } | null;
	courier?: {
		id: string;
		user: { name: string; phone: string | null };
	} | null;
};

export type CourierShipment = {
	id: string;
	trackingNumber: string;
	status: ShipmentStatus;
	deliveryType: DeliveryType;
	deliveryAttempts: number;
	pickupName: string;
	pickupPhone: string;
	pickupAddress: string;
	pickupCity: string;
	pickupScheduledAt: string | null;
	receiverName: string;
	receiverPhone: string;
	receiverAddress: string;
	receiverCity: string;
	parcelDescription: string | null;
	weightKg: string;
};

export type TrackingResult = {
	trackingNumber: string;
	status: ShipmentStatus;
	deliveryType: DeliveryType;
	pickupCity: string;
	receiverCity: string;
	createdAt: string;
	deliveredAt: string | null;
	trackingEvents: TrackingEvent[];
};

export type PartyInput = {
	name: string;
	phone: string;
	address: string;
	city: string;
};

export type CreateShipmentInput = {
	pickup: PartyInput;
	receiver: PartyInput;
	weightKg: number;
	deliveryType: DeliveryType;
	parcelDescription?: string;
	pickupScheduledAt?: string;
};

export type CreateShipmentResult = {
	shipment: Shipment;
	paymentUrl: string;
};

export type ShipmentListQuery = {
	page?: number;
	limit?: number;
	status?: ShipmentStatus;
	courierId?: string;
};
