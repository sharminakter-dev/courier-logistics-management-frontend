"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { shipmentsApi } from "@/api/shipments.api";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toaster";
import { toApiError } from "@/lib/api/request";

export function CancelShipmentButton({ shipmentId }: { shipmentId: string }) {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);
	const [reason, setReason] = useState("");

	const mutation = useMutation({
		mutationFn: () => shipmentsApi.cancel(shipmentId, reason.trim() || undefined),
		onSuccess: async () => {
			toast.success("Shipment cancelled");
			setOpen(false);
			await queryClient.invalidateQueries({ queryKey: ["shipment", shipmentId] });
			await queryClient.invalidateQueries({ queryKey: ["shipments"] });
		},
		onError: (error) => toast.error(toApiError(error).message),
	});

	return (
		<>
			<Button variant="destructive" onClick={() => setOpen(true)}>
				Cancel shipment
			</Button>
			<Modal
				open={open}
				onOpenChange={setOpen}
				title="Cancel this shipment?"
				description="A paid shipment is refunded through bKash automatically. This cannot be undone."
			>
				<div className="space-y-4">
					<Textarea
						placeholder="Reason (optional)"
						maxLength={255}
						value={reason}
						onChange={(event) => setReason(event.target.value)}
					/>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Keep shipment
						</Button>
						<Button
							variant="destructive"
							disabled={mutation.isPending}
							onClick={() => mutation.mutate()}
						>
							{mutation.isPending ? "Cancelling..." : "Yes, cancel"}
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}
