"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { shipmentsApi } from "@/api/shipments.api";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { toApiError } from "@/lib/api/request";
import { cn } from "@/lib/utils";
import { ShipmentsTable } from "./shipments-table";

export function RecentShipments() {
	const query = useQuery({
		queryKey: ["shipments", "mine", "recent"],
		queryFn: () => shipmentsApi.mine({ page: 1, limit: 5 }),
	});

	return (
		<Card>
			<CardHeader className="flex-row items-center justify-between">
				<CardTitle>Recent shipments</CardTitle>
				<Link
					href="/dashboard/new-shipment"
					className={cn(buttonVariants({ size: "sm" }))}
				>
					New shipment
				</Link>
			</CardHeader>
			{query.isPending ? (
				<ListSkeleton rows={3} />
			) : query.isError ? (
				<ErrorState message={toApiError(query.error).message} />
			) : query.data.data.length === 0 ? (
				<EmptyState title="No shipments yet" description="Your shipments will appear here." />
			) : (
				<ShipmentsTable items={query.data.data} basePath="/dashboard/my-shipments" />
			)}
		</Card>
	);
}
