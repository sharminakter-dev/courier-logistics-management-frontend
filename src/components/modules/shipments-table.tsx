import Link from "next/link";
import { PaymentBadge, StatusBadge } from "@/components/shared/StatusBadge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ShipmentListItem } from "@/types/shipment.type";
import { formatCurrency, formatDate } from "@/utils/format";

type ShipmentsTableProps = {
	items: ShipmentListItem[];
	/** Detail page prefix, e.g. /admin/shipments */
	basePath: string;
	showCourier?: boolean;
};

export function ShipmentsTable({ items, basePath, showCourier }: ShipmentsTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Tracking</TableHead>
					<TableHead>Route</TableHead>
					<TableHead>Receiver</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Payment</TableHead>
					{showCourier && <TableHead>Courier</TableHead>}
					<TableHead className="text-right">Price</TableHead>
					<TableHead>Created</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{items.map((item) => (
					<TableRow key={item.id}>
						<TableCell>
							<Link
								href={`${basePath}/${item.id}`}
								className="font-mono text-xs font-medium text-primary hover:underline"
							>
								{item.trackingNumber}
							</Link>
						</TableCell>
						<TableCell className="whitespace-nowrap">
							{item.pickupCity} to {item.receiverCity}
						</TableCell>
						<TableCell>{item.receiverName}</TableCell>
						<TableCell>
							<StatusBadge status={item.status} />
						</TableCell>
						<TableCell>
							{item.payment ? <PaymentBadge status={item.payment.status} /> : "-"}
						</TableCell>
						{showCourier && (
							<TableCell>{item.courier?.user.name ?? "Unassigned"}</TableCell>
						)}
						<TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
						<TableCell className="whitespace-nowrap text-muted-foreground">
							{formatDate(item.createdAt)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
