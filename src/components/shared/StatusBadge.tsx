import { Badge } from "@/components/ui/badge";
import { formatStatus } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PaymentStatus, ShipmentStatus } from "@/types/enums";

type Tone = "neutral" | "info" | "warning" | "success" | "danger";

const TONE_CLASSES: Record<Tone, string> = {
	neutral: "bg-muted text-muted-foreground",
	info: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
	warning: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
	success: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
	danger: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
};

const SHIPMENT_TONES: Record<ShipmentStatus, Tone> = {
	PENDING_PAYMENT: "warning",
	PICKUP_REQUESTED: "info",
	COURIER_ASSIGNED: "info",
	PICKED_UP: "info",
	AT_ORIGIN_HUB: "info",
	IN_TRANSIT: "info",
	AT_DESTINATION_HUB: "info",
	OUT_FOR_DELIVERY: "info",
	DELIVERED: "success",
	DELIVERY_FAILED: "danger",
	RETURNING: "warning",
	RETURNED: "neutral",
	CANCELLED: "danger",
};

const PAYMENT_TONES: Record<PaymentStatus, Tone> = {
	PENDING: "warning",
	PAID: "success",
	FAILED: "danger",
	CANCELLED: "neutral",
	REFUNDED: "info",
};

export function StatusBadge({
	label,
	tone,
	className,
}: {
	label: string;
	tone: Tone;
	className?: string;
}) {
	return (
		<Badge variant="secondary" className={cn(TONE_CLASSES[tone], className)}>
			{label}
		</Badge>
	);
}

export function ShipmentStatusBadge({ status }: { status: ShipmentStatus }) {
	return <StatusBadge label={formatStatus(status)} tone={SHIPMENT_TONES[status]} />;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
	return <StatusBadge label={formatStatus(status)} tone={PAYMENT_TONES[status]} />;
}