import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PaymentStatus, ShipmentStatus } from "@/types/shipment.type";
import { labelize } from "@/utils/format";
import { STATUS_STYLES } from "@/utils/status";

export function StatusBadge({ status }: { status: ShipmentStatus }) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
				STATUS_STYLES[status],
			)}
		>
			{labelize(status)}
		</span>
	);
}

const PAYMENT_VARIANT = {
	PAID: "success",
	PENDING: "warning",
	FAILED: "destructive",
	CANCELLED: "secondary",
	REFUNDED: "secondary",
} as const;

export function PaymentBadge({ status }: { status: PaymentStatus }) {
	return <Badge variant={PAYMENT_VARIANT[status]}>{labelize(status)}</Badge>;
}
