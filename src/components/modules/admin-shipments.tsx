"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { couriersApi } from "@/api/couriers.api";
import { shipmentsApi } from "@/api/shipments.api";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { toApiError } from "@/lib/api/request";
import { SHIPMENT_STATUSES, type ShipmentStatus } from "@/types/shipment.type";
import { labelize } from "@/utils/format";
import { ShipmentsTable } from "./shipments-table";

export function AdminShipments() {
	const [page, setPage] = useState(1);
	const [status, setStatus] = useState<ShipmentStatus | "">("");
	const [courierId, setCourierId] = useState("");

	const couriers = useQuery({
		queryKey: ["couriers", "options"],
		queryFn: async () => (await couriersApi.list({ limit: 100, isApproved: true })).data,
	});

	const query = useQuery({
		queryKey: ["shipments", "admin", page, status, courierId],
		queryFn: () =>
			shipmentsApi.list({
				page,
				limit: 10,
				status: status || undefined,
				courierId: courierId || undefined,
			}),
		placeholderData: keepPreviousData,
	});

	return (
		<Card>
			<div className="flex flex-wrap gap-3 border-b p-4">
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
				<Select
					aria-label="Filter by courier"
					className="w-52"
					value={courierId}
					onChange={(event) => {
						setCourierId(event.target.value);
						setPage(1);
					}}
				>
					<option value="">All couriers</option>
					{couriers.data?.map((courier) => (
						<option key={courier.id} value={courier.id}>
							{courier.user.name}
						</option>
					))}
				</Select>
			</div>

			{query.isPending ? (
				<ListSkeleton />
			) : query.isError ? (
				<ErrorState message={toApiError(query.error).message} />
			) : query.data.data.length === 0 ? (
				<EmptyState title="No shipments found" description="Try changing the filters." />
			) : (
				<>
					<ShipmentsTable items={query.data.data} basePath="/admin/shipments" showCourier />
					<Pagination meta={query.data.meta} onPageChange={setPage} />
				</>
			)}
		</Card>
	);
}
