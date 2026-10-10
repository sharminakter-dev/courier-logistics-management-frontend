export const ROLES = ["ADMIN", "COURIER", "CUSTOMER"] as const;
export type Role = (typeof ROLES)[number];

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

export const DELIVERY_TYPES = ["STANDARD", "EXPRESS"] as const;
export type DeliveryType = (typeof DELIVERY_TYPES)[number];

export const PAYMENT_STATUSES = [
	"PENDING",
	"PAID",
	"FAILED",
	"CANCELLED",
	"REFUNDED",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const VEHICLE_TYPES = ["BICYCLE", "MOTORBIKE", "VAN", "TRUCK"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export type TransferStatus = "IN_TRANSIT" | "RECEIVED";
export type EarningStatus = "PENDING" | "PAID";