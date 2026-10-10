"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { earningsApi } from "@/api/misc.api";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toApiError } from "@/lib/api/request";
import { formatCurrency, formatDate } from "@/utils/format";

export function CourierEarnings() {
	const [page, setPage] = useState(1);
	const [status, setStatus] = useState<"" | "PENDING" | "PAID">("");

	const query = useQuery({
		queryKey: ["earnings", "mine", page, status],
		queryFn: () => earningsApi.mine({ page, limit: 10, status: status || undefined }),
		placeholderData: keepPreviousData,
	});

	const summary = query.data?.data.summary;

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-3">
				{[
					{ label: "Pending payout", value: summary?.pending },
					{ label: "Paid out", value: summary?.paid },
					{ label: "Total earned", value: summary?.total },
				].map((item) => (
					<Card key={item.label}>
						<CardHeader className="pb-1">
							<p className="text-sm text-muted-foreground">{item.label}</p>
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-semibold">
								{item.value === undefined ? "-" : formatCurrency(item.value)}
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<div className="border-b p-4">
					<Select
						aria-label="Filter by status"
						className="w-40"
						value={status}
						onChange={(event) => {
							setStatus(event.target.value as "" | "PENDING" | "PAID");
							setPage(1);
						}}
					>
						<option value="">All earnings</option>
						<option value="PENDING">Pending</option>
						<option value="PAID">Paid</option>
					</Select>
				</div>

				{query.isPending ? (
					<ListSkeleton />
				) : query.isError ? (
					<ErrorState message={toApiError(query.error).message} />
				) : query.data.data.earnings.length === 0 ? (
					<EmptyState
						title="No earnings yet"
						description="You earn 70% of the price when a shipment is delivered."
					/>
				) : (
					<>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Tracking</TableHead>
									<TableHead>Delivered</TableHead>
									<TableHead className="text-right">Amount</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Paid on</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{query.data.data.earnings.map((earning) => (
									<TableRow key={earning.id}>
										<TableCell className="font-mono text-xs">{earning.shipment.trackingNumber}</TableCell>
										<TableCell className="text-muted-foreground">
											{formatDate(earning.shipment.deliveredAt)}
										</TableCell>
										<TableCell className="text-right font-medium">{formatCurrency(earning.amount)}</TableCell>
										<TableCell>
											<Badge variant={earning.status === "PAID" ? "success" : "warning"}>
												{earning.status === "PAID" ? "Paid" : "Pending"}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground">{formatDate(earning.paidAt)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<Pagination meta={query.data.meta} onPageChange={setPage} />
					</>
				)}
			</Card>
		</div>
	);
}
