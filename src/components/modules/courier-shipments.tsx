"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { couriersApi } from "@/api/couriers.api";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { toApiError } from "@/lib/api/request";
import { SHIPMENT_STATUSES, type ShipmentStatus } from "@/types/shipment.type";
import { formatDateTime, labelize } from "@/utils/format";
import { UpdateStatusButton } from "./status-update";

function Party({
	title,
	name,
	phone,
	address,
	city,
}: {
	title: string;
	name: string;
	phone: string;
	address: string;
	city: string;
}) {
	return (
		<div className="space-y-1 text-sm">
			<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
			<p className="font-medium">{name}</p>
			<p className="flex items-center gap-1.5 text-muted-foreground">
				<Phone className="size-3.5" />
				<a href={`tel:${phone}`} className="hover:underline">
					{phone}
				</a>
			</p>
			<p className="flex items-start gap-1.5 text-muted-foreground">
				<MapPin className="mt-0.5 size-3.5 shrink-0" />
				{address}, {city}
			</p>
		</div>
	);
}

export function CourierShipments() {
	const [page, setPage] = useState(1);
	const [status, setStatus] = useState<ShipmentStatus | "">("");

	const query = useQuery({
		queryKey: ["courier-shipments", page, status],
		queryFn: () =>
			couriersApi.myShipments({ page, limit: 10, status: status || undefined }),
		placeholderData: keepPreviousData,
	});

	return (
		<div className="space-y-4">
			<Select
				aria-label="Filter by status"
				className="w-52"
				value={status}
				onChange={(event) => {
					setStatus(event.target.value as ShipmentStatus | "");
					setPage(1);
				}}
			>
				<option value="">All statuses</option>
				{SHIPMENT_STATUSES.map((item) => (
					<option key={item} value={item}>
						{labelize(item)}
					</option>
				))}
			</Select>

			{query.isPending ? (
				<ListSkeleton />
			) : query.isError ? (
				<ErrorState message={toApiError(query.error).message} />
			) : query.data.data.length === 0 ? (
				<Card>
					<EmptyState
						title="No deliveries assigned"
						description="Shipments assigned to you will show up here."
					/>
				</Card>
			) : (
				<>
					{query.data.data.map((shipment) => (
						<Card key={shipment.id}>
							<CardContent className="space-y-4 pt-5">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<div className="space-y-1">
										<p className="font-mono text-sm font-medium">{shipment.trackingNumber}</p>
										<p className="text-xs text-muted-foreground">
											{labelize(shipment.deliveryType)} · {shipment.weightKg} kg
											{shipment.deliveryAttempts > 0 &&
												` · ${shipment.deliveryAttempts} failed attempt${shipment.deliveryAttempts === 1 ? "" : "s"}`}
										</p>
									</div>
									<div className="flex items-center gap-3">
										<StatusBadge status={shipment.status} />
										<UpdateStatusButton
											shipmentId={shipment.id}
											status={shipment.status}
											role="courier"
										/>
									</div>
								</div>

								<div className="grid gap-4 sm:grid-cols-2">
									<Party
										title="Pickup"
										name={shipment.pickupName}
										phone={shipment.pickupPhone}
										address={shipment.pickupAddress}
										city={shipment.pickupCity}
									/>
									<Party
										title="Deliver to"
										name={shipment.receiverName}
										phone={shipment.receiverPhone}
										address={shipment.receiverAddress}
										city={shipment.receiverCity}
									/>
								</div>

								{(shipment.parcelDescription || shipment.pickupScheduledAt) && (
									<p className="text-xs text-muted-foreground">
										{shipment.parcelDescription}
										{shipment.parcelDescription && shipment.pickupScheduledAt ? " · " : ""}
										{shipment.pickupScheduledAt &&
											`Pickup ${formatDateTime(shipment.pickupScheduledAt)}`}
									</p>
								)}
							</CardContent>
						</Card>
					))}
					<Card>
						<Pagination meta={query.data.meta} onPageChange={setPage} />
					</Card>
				</>
			)}
		</div>
	);
}
