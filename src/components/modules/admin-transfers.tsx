"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Truck } from "lucide-react";
import { useState } from "react";
import { hubsApi, transfersApi } from "@/api/hubs.api";
import { shipmentsApi } from "@/api/shipments.api";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { TransferStatus } from "@/types/hub.type";
import { formatDateTime } from "@/utils/format";

function DispatchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [shipmentId, setShipmentId] = useState("");
	const [fromHubId, setFromHubId] = useState("");
	const [toHubId, setToHubId] = useState("");
	const [note, setNote] = useState("");

	const shipments = useQuery({
		queryKey: ["shipments", "at-origin-hub"],
		queryFn: async () => (await shipmentsApi.list({ status: "AT_ORIGIN_HUB", limit: 100 })).data,
		enabled: open,
	});
	const hubs = useQuery({
		queryKey: ["hubs", "options"],
		queryFn: async () => (await hubsApi.list({ limit: 100, isActive: true })).data,
		enabled: open,
	});

	const mutation = useMutation({
		mutationFn: () =>
			transfersApi.dispatch({ shipmentId, fromHubId, toHubId, note: note.trim() || undefined }),
		onSuccess: async () => {
			toast.success("Shipment dispatched");
			setShipmentId("");
			setNote("");
			onOpenChange(false);
			await queryClient.invalidateQueries({ queryKey: ["transfers"] });
			await queryClient.invalidateQueries({ queryKey: ["shipments"] });
			await queryClient.invalidateQueries({ queryKey: ["shipment"] });
		},
		onError: (error) => toast.error(toApiError(error).message),
	});

	const sameHub = !!fromHubId && fromHubId === toHubId;
	const ready = !!shipmentId && !!fromHubId && !!toHubId && !sameHub;

	return (
		<Modal
			open={open}
			onOpenChange={onOpenChange}
			title="Dispatch shipment"
			description="Moves a shipment from its origin hub to the destination hub."
		>
			<div className="space-y-4">
				<div className="space-y-1.5">
					<Label htmlFor="dispatch-shipment">Shipment (at origin hub)</Label>
					<Select id="dispatch-shipment" value={shipmentId} onChange={(e) => setShipmentId(e.target.value)}>
						<option value="">Select a shipment</option>
						{shipments.data?.map((shipment) => (
							<option key={shipment.id} value={shipment.id}>
								{shipment.trackingNumber} ({shipment.pickupCity} to {shipment.receiverCity})
							</option>
						))}
					</Select>
					{shipments.data?.length === 0 && (
						<p className="text-xs text-muted-foreground">
							No shipments are waiting at an origin hub.
						</p>
					)}
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-1.5">
						<Label htmlFor="dispatch-from">From hub</Label>
						<Select id="dispatch-from" value={fromHubId} onChange={(e) => setFromHubId(e.target.value)}>
							<option value="">Select</option>
							{hubs.data?.map((hub) => (
								<option key={hub.id} value={hub.id}>
									{hub.name}
								</option>
							))}
						</Select>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="dispatch-to">To hub</Label>
						<Select id="dispatch-to" value={toHubId} onChange={(e) => setToHubId(e.target.value)}>
							<option value="">Select</option>
							{hubs.data?.map((hub) => (
								<option key={hub.id} value={hub.id}>
									{hub.name}
								</option>
							))}
						</Select>
					</div>
				</div>
				{sameHub && <p className="text-xs text-destructive">From and to hub must be different.</p>}
				<div className="space-y-1.5">
					<Label htmlFor="dispatch-note">Note (optional)</Label>
					<Input id="dispatch-note" value={note} onChange={(e) => setNote(e.target.value)} />
				</div>
				<Button className="w-full" disabled={!ready || mutation.isPending} onClick={() => mutation.mutate()}>
					{mutation.isPending ? "Dispatching..." : "Dispatch"}
				</Button>
			</div>
		</Modal>
	);
}

export function AdminTransfers() {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [status, setStatus] = useState<TransferStatus | "">("");
	const [dispatching, setDispatching] = useState(false);

	const query = useQuery({
		queryKey: ["transfers", page, status],
		queryFn: () => transfersApi.list({ page, limit: 10, status: status || undefined }),
		placeholderData: keepPreviousData,
	});

	const receive = useMutation({
		mutationFn: (id: string) => transfersApi.receive(id),
		onSuccess: async () => {
			toast.success("Shipment received at destination hub");
			await queryClient.invalidateQueries({ queryKey: ["transfers"] });
			await queryClient.invalidateQueries({ queryKey: ["shipments"] });
			await queryClient.invalidateQueries({ queryKey: ["shipment"] });
		},
		onError: (error) => toast.error(toApiError(error).message),
	});

	return (
		<>
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<Select
					aria-label="Filter by status"
					className="w-44"
					value={status}
					onChange={(event) => {
						setStatus(event.target.value as TransferStatus | "");
						setPage(1);
					}}
				>
					<option value="">All transfers</option>
					<option value="IN_TRANSIT">In transit</option>
					<option value="RECEIVED">Received</option>
				</Select>
				<Button onClick={() => setDispatching(true)}>
					<Truck /> Dispatch shipment
				</Button>
			</div>
			<DispatchDialog open={dispatching} onOpenChange={setDispatching} />

			<Card>
				{query.isPending ? (
					<ListSkeleton />
				) : query.isError ? (
					<ErrorState message={toApiError(query.error).message} />
				) : query.data.data.length === 0 ? (
					<EmptyState title="No transfers found" />
				) : (
					<>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Tracking</TableHead>
									<TableHead>From</TableHead>
									<TableHead>To</TableHead>
									<TableHead>Transfer</TableHead>
									<TableHead>Shipment</TableHead>
									<TableHead>Dispatched</TableHead>
									<TableHead>Received</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{query.data.data.map((transfer) => (
									<TableRow key={transfer.id}>
										<TableCell className="font-mono text-xs font-medium">
											{transfer.shipment.trackingNumber}
										</TableCell>
										<TableCell>{transfer.fromHub.name}</TableCell>
										<TableCell>{transfer.toHub.name}</TableCell>
										<TableCell>
											<Badge variant={transfer.status === "RECEIVED" ? "success" : "warning"}>
												{transfer.status === "RECEIVED" ? "Received" : "In transit"}
											</Badge>
										</TableCell>
										<TableCell>
											<StatusBadge status={transfer.shipment.status} />
										</TableCell>
										<TableCell className="whitespace-nowrap text-muted-foreground">
											{formatDateTime(transfer.dispatchedAt)}
										</TableCell>
										<TableCell className="whitespace-nowrap text-muted-foreground">
											{formatDateTime(transfer.receivedAt)}
										</TableCell>
										<TableCell className="text-right">
											{transfer.status === "IN_TRANSIT" && (
												<Button
													size="sm"
													disabled={receive.isPending}
													onClick={() => receive.mutate(transfer.id)}
												>
													Mark received
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
		</>
	);
}
