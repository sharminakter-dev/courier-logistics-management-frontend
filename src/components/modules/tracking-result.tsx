"use client";

import { useQuery } from "@tanstack/react-query";
import { shipmentsApi } from "@/api/shipments.api";
import { ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TrackingTimeline } from "@/components/shared/TrackingTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toApiError } from "@/lib/api/request";
import { formatDate, labelize } from "@/utils/format";

export function TrackingResult({ trackingNumber }: { trackingNumber: string }) {
	const { data, isPending, error } = useQuery({
		queryKey: ["track", trackingNumber],
		queryFn: async () => (await shipmentsApi.track(trackingNumber)).data,
		retry: false,
	});

	if (isPending) return <ListSkeleton rows={4} />;
	if (error) return <ErrorState message={toApiError(error).message} />;

	return (
		<Card>
			<CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
				<div>
					<CardTitle className="font-mono text-lg">{data.trackingNumber}</CardTitle>
					<p className="mt-1 text-sm text-muted-foreground">
						{data.pickupCity} to {data.receiverCity} · {labelize(data.deliveryType)} ·{" "}
						{formatDate(data.createdAt)}
					</p>
				</div>
				<StatusBadge status={data.status} />
			</CardHeader>
			<CardContent className="pt-4">
				<TrackingTimeline events={data.trackingEvents} newestFirst={false} />
			</CardContent>
		</Card>
	);
}
