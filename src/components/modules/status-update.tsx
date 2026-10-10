"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { shipmentsApi } from "@/api/shipments.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toaster";
import { toApiError } from "@/lib/api/request";
import type { ShipmentStatus, UpdatableStatus } from "@/types/shipment.type";
import { labelize } from "@/utils/format";
import { ADMIN_NEXT_STATUS, COURIER_ALLOWED } from "@/utils/status";

/** Statuses the given role can move this shipment to from its current status. */
export function nextStatusOptions(
	current: ShipmentStatus,
	role: "admin" | "courier",
): UpdatableStatus[] {
	const options = ADMIN_NEXT_STATUS[current] ?? [];
	return role === "admin" ? options : options.filter((s) => COURIER_ALLOWED.includes(s));
}

export function StatusUpdateForm({
	shipmentId,
	options,
	onDone,
}: {
	shipmentId: string;
	options: UpdatableStatus[];
	onDone?: () => void;
}) {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [status, setStatus] = useState<UpdatableStatus>(options[0]);
	const [note, setNote] = useState("");
	const [location, setLocation] = useState("");

	const mutation = useMutation({
		mutationFn: () =>
			shipmentsApi.updateStatus(shipmentId, {
				status,
				note: note.trim() || undefined,
				location: location.trim() || undefined,
			}),
		onSuccess: async () => {
			toast.success(`Status updated to ${labelize(status)}`);
			await queryClient.invalidateQueries({ queryKey: ["shipment", shipmentId] });
			await queryClient.invalidateQueries({ queryKey: ["shipments"] });
			await queryClient.invalidateQueries({ queryKey: ["courier-shipments"] });
			await queryClient.invalidateQueries({ queryKey: ["courier", "me"] });
			onDone?.();
		},
		onError: (error) => toast.error(toApiError(error).message),
	});

	return (
		<form
			className="space-y-4"
			onSubmit={(event) => {
				event.preventDefault();
				mutation.mutate();
			}}
		>
			<div className="space-y-1.5">
				<Label htmlFor="next-status">New status</Label>
				<Select
					id="next-status"
					value={status}
					onChange={(event) => setStatus(event.target.value as UpdatableStatus)}
				>
					{options.map((option) => (
						<option key={option} value={option}>
							{labelize(option)}
						</option>
					))}
				</Select>
			</div>
			<div className="space-y-1.5">
				<Label htmlFor="status-note">Note (optional)</Label>
				<Input
					id="status-note"
					maxLength={255}
					value={note}
					onChange={(event) => setNote(event.target.value)}
				/>
			</div>
			<div className="space-y-1.5">
				<Label htmlFor="status-location">Location (optional)</Label>
				<Input
					id="status-location"
					maxLength={150}
					value={location}
					onChange={(event) => setLocation(event.target.value)}
				/>
			</div>
			<div className="flex justify-end">
				<Button type="submit" disabled={mutation.isPending}>
					{mutation.isPending ? "Updating..." : "Update status"}
				</Button>
			</div>
		</form>
	);
}

/** Button + dialog used on the courier delivery cards. */
export function UpdateStatusButton({
	shipmentId,
	status,
	role,
}: {
	shipmentId: string;
	status: ShipmentStatus;
	role: "admin" | "courier";
}) {
	const [open, setOpen] = useState(false);
	const options = nextStatusOptions(status, role);

	if (options.length === 0) return null;

	return (
		<>
			<Button size="sm" onClick={() => setOpen(true)}>
				Update status
			</Button>
			<Modal open={open} onOpenChange={setOpen} title="Update shipment status">
				<StatusUpdateForm
					shipmentId={shipmentId}
					options={options}
					onDone={() => setOpen(false)}
				/>
			</Modal>
		</>
	);
}
