import { DetailRow } from "@/components/shared/DetailRow";
import { PaymentBadge, StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Shipment } from "@/types/shipment.type";
import { formatCurrency, formatDateTime, labelize } from "@/utils/format";

export function ShipmentInfo({ shipment }: { shipment: Shipment }) {
	return (
		<div className="grid gap-4 lg:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle>Pickup</CardTitle>
				</CardHeader>
				<CardContent>
					<dl className="divide-y">
						<DetailRow label="Name">{shipment.pickupName}</DetailRow>
						<DetailRow label="Phone">{shipment.pickupPhone}</DetailRow>
						<DetailRow label="Address">
							{shipment.pickupAddress}, {shipment.pickupCity}
						</DetailRow>
						<DetailRow label="Scheduled">{formatDateTime(shipment.pickupScheduledAt)}</DetailRow>
					</dl>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Receiver</CardTitle>
				</CardHeader>
				<CardContent>
					<dl className="divide-y">
						<DetailRow label="Name">{shipment.receiverName}</DetailRow>
						<DetailRow label="Phone">{shipment.receiverPhone}</DetailRow>
						<DetailRow label="Address">
							{shipment.receiverAddress}, {shipment.receiverCity}
						</DetailRow>
						<DetailRow label="Delivered">{formatDateTime(shipment.deliveredAt)}</DetailRow>
					</dl>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Parcel</CardTitle>
				</CardHeader>
				<CardContent>
					<dl className="divide-y">
						<DetailRow label="Status">
							<StatusBadge status={shipment.status} />
						</DetailRow>
						<DetailRow label="Service">{labelize(shipment.deliveryType)}</DetailRow>
						<DetailRow label="Weight">{shipment.weightKg} kg</DetailRow>
						<DetailRow label="Description">{shipment.parcelDescription || "-"}</DetailRow>
						<DetailRow label="Delivery attempts">{shipment.deliveryAttempts}</DetailRow>
					</dl>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Payment</CardTitle>
				</CardHeader>
				<CardContent>
					<dl className="divide-y">
						<DetailRow label="Price">{formatCurrency(shipment.price)}</DetailRow>
						<DetailRow label="Status">
							{shipment.payment ? <PaymentBadge status={shipment.payment.status} /> : "-"}
						</DetailRow>
						<DetailRow label="bKash transaction">{shipment.payment?.bkashTrxId || "-"}</DetailRow>
						<DetailRow label="Paid at">{formatDateTime(shipment.payment?.paidAt)}</DetailRow>
					</dl>
				</CardContent>
			</Card>
		</div>
	);
}
