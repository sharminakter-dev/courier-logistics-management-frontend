"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { couriersApi } from "@/api/couriers.api";
import { earningsApi } from "@/api/misc.api";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toaster";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toApiError } from "@/lib/api/request";
import type { EarningStatus } from "@/types/misc.type";
import { formatCurrency, formatDate } from "@/utils/format";

export function AdminEarnings() {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [status, setStatus] = useState<EarningStatus | "">("");
	const [courierId, setCourierId] = useState("");
	const [payoutFor, setPayoutFor] = useState<{ id: string; name: string } | null>(null);

	const couriers = useQuery({
		queryKey: ["couriers", "options"],
		queryFn: async () => (await couriersApi.list({ limit: 100, isApproved: true })).data,
	});

	const query = useQuery({
		queryKey: ["earnings", "admin", page, status, courierId],
		queryFn: () =>
			earningsApi.list({
				page,
				limit: 10,
				status: status || undefined,
				courierId: courierId || undefined,
			}),
		placeholderData: keepPreviousData,
	});

	const payout = useMutation({
		mutationFn: (id: string) => earningsApi.payout(id),
		onSuccess: async (res) => {
			toast.success(
				`Paid ${formatCurrency(res.data.totalPaid)} for ${res.data.count} shipment${res.data.count === 1 ? "" : "s"}`,
			);
			setPayoutFor(null);
			await queryClient.invalidateQueries({ queryKey: ["earnings"] });
			await queryClient.invalidateQueries({ queryKey: ["analytics"] });
		},
		onError: (error) => toast.error(toApiError(error).message),
	});

	return (
		<>
			<Card>
				<div className="flex flex-wrap gap-3 border-b p-4">
					<Select
						aria-label="Filter by status"
						className="w-40"
						value={status}
						onChange={(event) => {
							setStatus(event.target.value as EarningStatus | "");
							setPage(1);
						}}
					>
						<option value="">All statuses</option>
						<option value="PENDING">Pending</option>
						<option value="PAID">Paid</option>
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
					<EmptyState title="No earnings found" description="Earnings are created when shipments are delivered." />
				) : (
					<>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Courier</TableHead>
									<TableHead>Tracking</TableHead>
									<TableHead>Delivered</TableHead>
									<TableHead className="text-right">Amount</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{query.data.data.map((earning) => (
									<TableRow key={earning.id}>
										<TableCell>{earning.courier?.user.name ?? "-"}</TableCell>
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
										<TableCell className="text-right">
											{earning.status === "PENDING" && (
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														setPayoutFor({
															id: earning.courierId,
															name: earning.courier?.user.name ?? "this courier",
														})
													}
												>
													Pay out
												</Button>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<Pagination meta={query.data.meta} onPageChange={setPage} />
					</>
				)}
			</Card>

			<Modal
				open={!!payoutFor}
				onOpenChange={(open) => {
					if (!open) setPayoutFor(null);
				}}
				title="Confirm payout"
				description={`Pay all pending earnings to ${payoutFor?.name ?? ""} in one transaction. The courier will be notified.`}
			>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={() => setPayoutFor(null)}>
						Cancel
					</Button>
					<Button
						disabled={payout.isPending}
						onClick={() => payoutFor && payout.mutate(payoutFor.id)}
					>
						{payout.isPending ? "Paying..." : "Pay out"}
					</Button>
				</div>
			</Modal>
		</>
	);
}
