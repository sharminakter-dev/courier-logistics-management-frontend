"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { analyticsApi } from "@/api/misc.api";
import { ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toApiError } from "@/lib/api/request";
import { SHIPMENT_STATUSES } from "@/types/shipment.type";
import { formatCurrency, labelize } from "@/utils/format";

function StatCard({
	title,
	value,
	hint,
}: {
	title: string;
	value: string;
	hint?: string;
}) {
	return (
		<Card>
			<CardHeader className="pb-1">
				<CardDescription>{title}</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-2xl font-semibold">{value}</p>
				{hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
			</CardContent>
		</Card>
	);
}

function TrendChart() {
	const [days, setDays] = useState(30);
	const query = useQuery({
		queryKey: ["analytics", "trend", days],
		queryFn: async () => (await analyticsApi.trend(days)).data,
	});

	const points = query.data?.trend ?? [];
	const max = Math.max(1, ...points.map((point) => point.shipments));

	return (
		<Card>
			<CardHeader className="flex-row items-start justify-between gap-3">
				<div className="space-y-1">
					<CardTitle>Shipments trend</CardTitle>
					<CardDescription>New shipments per day</CardDescription>
				</div>
				<Select
					aria-label="Range"
					className="w-32"
					value={days}
					onChange={(event) => setDays(Number(event.target.value))}
				>
					<option value={7}>Last 7 days</option>
					<option value={30}>Last 30 days</option>
					<option value={90}>Last 90 days</option>
				</Select>
			</CardHeader>
			<CardContent>
				{query.isPending ? (
					<Skeleton className="h-44 w-full" />
				) : query.isError ? (
					<ErrorState message={toApiError(query.error).message} />
				) : points.length === 0 ? (
					<p className="py-12 text-center text-sm text-muted-foreground">No data for this period.</p>
				) : (
					<div className="flex h-44 items-end gap-1" role="img" aria-label="Shipments per day">
						{points.map((point) => (
							<div
								key={point.date}
								title={`${point.date}: ${point.shipments} shipments, ${formatCurrency(point.revenue)}`}
								className="min-w-0 flex-1 rounded-t bg-primary/70 transition-colors hover:bg-primary"
								style={{ height: `${Math.max(4, (point.shipments / max) * 100)}%` }}
							/>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function TopCouriers() {
	const query = useQuery({
		queryKey: ["analytics", "top-couriers"],
		queryFn: async () => (await analyticsApi.topCouriers(5)).data,
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Top couriers</CardTitle>
				<CardDescription>By delivered shipments</CardDescription>
			</CardHeader>
			<CardContent>
				{query.isPending ? (
					<ListSkeleton rows={3} />
				) : query.isError ? (
					<ErrorState message={toApiError(query.error).message} />
				) : query.data.length === 0 ? (
					<p className="py-6 text-center text-sm text-muted-foreground">No deliveries yet.</p>
				) : (
					<ol className="divide-y">
						{query.data.map((courier, index) => (
							<li key={courier.courierId} className="flex items-center justify-between py-2.5 text-sm">
								<span>
									<span className="mr-2 text-muted-foreground">{index + 1}.</span>
									{courier.name}
								</span>
								<span className="font-medium">{courier.delivered} delivered</span>
							</li>
						))}
					</ol>
				)}
			</CardContent>
		</Card>
	);
}

export function AdminOverview() {
	const query = useQuery({
		queryKey: ["analytics", "overview"],
		queryFn: async () => (await analyticsApi.overview()).data,
	});

	if (query.isPending) {
		return (
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 8 }, (_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
					<Skeleton key={index} className="h-24" />
				))}
			</div>
		);
	}
	if (query.isError) return <ErrorState message={toApiError(query.error).message} />;

	const data = query.data;
	const total = Math.max(1, data.shipments.total);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard title="Total shipments" value={String(data.shipments.total)} hint={`${data.shipments.today} today`} />
				<StatCard title="Revenue" value={formatCurrency(data.revenue.total)} hint={`${formatCurrency(data.revenue.refunded)} refunded`} />
				<StatCard title="Delivery success" value={`${data.shipments.deliverySuccessRate}%`} hint="Delivered vs returned" />
				<StatCard title="Pending payouts" value={formatCurrency(data.couriers.pendingEarnings)} />
				<StatCard title="Couriers" value={String(data.couriers.total)} hint={`${data.couriers.available} available`} />
				<StatCard title="Customers" value={String(data.customers.total)} />
				<StatCard title="Active hubs" value={String(data.hubs.active)} />
				<StatCard
					title="In transit now"
					value={String(
						data.shipments.byStatus.IN_TRANSIT + data.shipments.byStatus.OUT_FOR_DELIVERY,
					)}
					hint="In transit + out for delivery"
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<TrendChart />
				</div>
				<TopCouriers />
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Shipments by status</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
					{SHIPMENT_STATUSES.map((status) => {
						const count = data.shipments.byStatus[status] ?? 0;
						return (
							<div key={status} className="space-y-1">
								<div className="flex justify-between text-sm">
									<span>{labelize(status)}</span>
									<span className="font-medium">{count}</span>
								</div>
								<div className="h-1.5 overflow-hidden rounded-full bg-muted">
									<div
										className="h-full rounded-full bg-primary"
										style={{ width: `${(count / total) * 100}%` }}
									/>
								</div>
							</div>
						);
					})}
				</CardContent>
			</Card>
		</div>
	);
}
