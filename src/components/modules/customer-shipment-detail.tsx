"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { shipmentsApi } from "@/api/shipments.api";
import { ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { TrackingTimeline } from "@/components/shared/TrackingTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toaster";
import { toApiError } from "@/lib/api/request";
import { CANCELLABLE_STATUSES } from "@/utils/status";
import { CancelShipmentButton } from "./cancel-shipment";
import { ShipmentInfo } from "./shipment-info";

export function CustomerShipmentDetail({ id }: { id: string }) {
	const toast = useToast();

	const query = useQuery({
		queryKey: ["shipment", id],
		queryFn: async () => (await shipmentsApi.get(id)).data,
	});

	const pay = useMutation({
		mutationFn: () => shipmentsApi.pay(id),
		onSuccess: (res) => {
			window.location.href = res.data.paymentUrl;
		},
		onError: (error) => toast.error(toApiError(error).message),
	});

	if (query.isPending) return <ListSkeleton rows={6} />;
	if (query.isError) return <ErrorState message={toApiError(query.error).message} />;

	const shipment = query.data;
	const canCancel = CANCELLABLE_STATUSES.includes(shipment.status);
	const needsPayment = shipment.status === "PENDING_PAYMENT";

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<p className="font-mono text-sm text-muted-foreground">{shipment.trackingNumber}</p>
				<div className="flex gap-2">
					{needsPayment && (
						<Button disabled={pay.isPending} onClick={() => pay.mutate()}>
							<CreditCard /> {pay.isPending ? "Redirecting..." : "Pay with bKash"}
						</Button>
					)}
					{canCancel && <CancelShipmentButton shipmentId={shipment.id} />}
				</div>
			</div>

			<ShipmentInfo shipment={shipment} />

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
