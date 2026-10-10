"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { couriersApi } from "@/api/couriers.api";
import { shipmentsApi } from "@/api/shipments.api";
import { ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { TrackingTimeline } from "@/components/shared/TrackingTimeline";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toaster";
import { toApiError } from "@/lib/api/request";
import { cn } from "@/lib/utils";
import { CANCELLABLE_STATUSES } from "@/utils/status";
import { CancelShipmentButton } from "./cancel-shipment";
import { ShipmentInfo } from "./shipment-info";
import { nextStatusOptions, StatusUpdateForm } from "./status-update";

function AssignCourierCard({ shipmentId, currentCourierId }: { shipmentId: string; currentCourierId: string | null }) {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [courierId, setCourierId] = useState("");

	const couriers = useQuery({
		queryKey: ["couriers", "assignable"],
		queryFn: async () =>
			(await couriersApi.list({ limit: 100, isApproved: true, isAvailable: true })).data,
	});

	const mutation = useMutation({
		mutationFn: () => shipmentsApi.assignCourier(shipmentId, courierId),
		onSuccess: async () => {
			toast.success("Courier assigned");
			setCourierId("");
			await queryClient.invalidateQueries({ queryKey: ["shipment", shipmentId] });
			await queryClient.invalidateQueries({ queryKey: ["shipments"] });
		},
		onError: (error) => toast.error(toApiError(error).message),
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>{currentCourierId ? "Reassign courier" : "Assign courier"}</CardTitle>
				<CardDescription>Only approved, available couriers are listed.</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-wrap gap-2">
				<Select
					aria-label="Courier"
					className="min-w-56 flex-1"
					value={courierId}
					onChange={(event) => setCourierId(event.target.value)}
				>
					<option value="">Select a courier</option>
					{couriers.data
						?.filter((courier) => courier.id !== currentCourierId)
						.map((courier) => (
							<option key={courier.id} value={courier.id}>
								{courier.user.name}
								{courier.hub ? ` (${courier.hub.name})` : ""}
							</option>
						))}
				</Select>
				<Button disabled={!courierId || mutation.isPending} onClick={() => mutation.mutate()}>
					{mutation.isPending ? "Assigning..." : "Assign"}
				</Button>
			</CardContent>
		</Card>
	);
}

export function AdminShipmentDetail({ id }: { id: string }) {
	const query = useQuery({
		queryKey: ["shipment", id],
		queryFn: async () => (await shipmentsApi.get(id)).data,
	});

	if (query.isPending) return <ListSkeleton rows={6} />;
	if (query.isError) return <ErrorState message={toApiError(query.error).message} />;

	const shipment = query.data;
	const options = nextStatusOptions(shipment.status, "admin");
	const canAssign = shipment.status === "PICKUP_REQUESTED" || shipment.status === "COURIER_ASSIGNED";
	const canCancel = CANCELLABLE_STATUSES.includes(shipment.status);
	const transferStep = shipment.status === "AT_ORIGIN_HUB" || shipment.status === "IN_TRANSIT";

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<p className="font-mono text-sm text-muted-foreground">{shipment.trackingNumber}</p>
				{canCancel && <CancelShipmentButton shipmentId={shipment.id} />}
			</div>

			<ShipmentInfo shipment={shipment} />

			<div className="grid gap-6 lg:grid-cols-2">
				{canAssign && (
					<AssignCourierCard shipmentId={shipment.id} currentCourierId={shipment.courierId} />
				)}

				{options.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Update status</CardTitle>
						</CardHeader>
						<CardContent>
							{/* key resets the form when the shipment moves to a new status */}
							<StatusUpdateForm key={shipment.status} shipmentId={shipment.id} options={options} />
						</CardContent>
					</Card>
				)}

				{transferStep && (
					<Card>
						<CardHeader>
							<CardTitle>Hub transfer</CardTitle>
							<CardDescription>
								{shipment.status === "AT_ORIGIN_HUB"
									? "Dispatch this shipment to the destination hub."
									: "Mark this shipment as received at the destination hub."}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Link
								href="/admin/transfers"
								className={cn(buttonVariants({ variant: "outline" }))}
							>
								Go to hub transfers
							</Link>
						</CardContent>
					</Card>
				)}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Tracking history</CardTitle>
				</CardHeader>
				<CardContent className="pt-3">
					<TrackingTimeline events={shipment.trackingEvents ?? []} />
				</CardContent>
			</Card>
		</div>
	);
}
