import type { ShipmentStatus, UpdatableStatus } from "@/types/shipment.type";

export const STATUS_STYLES: Record<ShipmentStatus, string> = {
	PENDING_PAYMENT: "bg-amber-100 text-amber-800",
	PICKUP_REQUESTED: "bg-sky-100 text-sky-800",
	COURIER_ASSIGNED: "bg-indigo-100 text-indigo-800",
	PICKED_UP: "bg-violet-100 text-violet-800",
	AT_ORIGIN_HUB: "bg-purple-100 text-purple-800",
	IN_TRANSIT: "bg-blue-100 text-blue-800",
	AT_DESTINATION_HUB: "bg-cyan-100 text-cyan-800",
	OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
	DELIVERED: "bg-green-100 text-green-800",
	DELIVERY_FAILED: "bg-red-100 text-red-800",
	RETURNING: "bg-rose-100 text-rose-800",
	RETURNED: "bg-zinc-200 text-zinc-800",
	CANCELLED: "bg-zinc-200 text-zinc-600",
};

/** Next statuses an admin can set from the status endpoint. */
export const ADMIN_NEXT_STATUS: Partial<
	Record<ShipmentStatus, UpdatableStatus[]>
> = {
	COURIER_ASSIGNED: ["PICKED_UP"],
	PICKED_UP: ["AT_ORIGIN_HUB"],
	AT_DESTINATION_HUB: ["OUT_FOR_DELIVERY"],
	OUT_FOR_DELIVERY: ["DELIVERED", "DELIVERY_FAILED"],
	DELIVERY_FAILED: ["OUT_FOR_DELIVERY", "RETURNING"],
	RETURNING: ["RETURNED"],
};

/** Statuses a courier is allowed to set. */
export const COURIER_ALLOWED: UpdatableStatus[] = [
	"PICKED_UP",
	"OUT_FOR_DELIVERY",
	"DELIVERED",
	"DELIVERY_FAILED",
];

export const CANCELLABLE_STATUSES: ShipmentStatus[] = [
	"PENDING_PAYMENT",
	"PICKUP_REQUESTED",
	"COURIER_ASSIGNED",
];
