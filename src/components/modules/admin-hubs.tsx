"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { hubsApi } from "@/api/hubs.api";
import { FormField } from "@/components/form/form-field";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { type HubFormValues, hubSchema } from "@/validation/shipment.validation";

function CreateHubDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { name: "", code: "", city: "", address: "", phone: "" } as HubFormValues,
		validators: { onSubmit: hubSchema },
		onSubmit: async ({ value }) => {
			setError(null);
			try {
				await hubsApi.create({ ...value, phone: value.phone || undefined });
				toast.success("Hub created");
				await queryClient.invalidateQueries({ queryKey: ["hubs"] });
				form.reset();
				onOpenChange(false);
			} catch (err) {
				setError(toApiError(err).message);
			}
		},
	});

	const fields = [
		{ name: "name", label: "Hub name" },
		{ name: "code", label: "Code", hint: "2 to 10 letters, numbers or -" },
		{ name: "city", label: "City" },
		{ name: "address", label: "Address" },
		{ name: "phone", label: "Phone (optional)" },
	] as const;

	return (
		<Modal open={open} onOpenChange={onOpenChange} title="Create hub">
			<form
				className="space-y-4"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					form.handleSubmit();
				}}
			>
				{fields.map((item) => (
					<form.Field key={item.name} name={item.name}>
						{(field) => (
							<FormField
								label={item.label}
								htmlFor={`hub-${item.name}`}
								hint={"hint" in item ? item.hint : undefined}
								errors={field.state.meta.errors}
							>
								<Input
									id={`hub-${item.name}`}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(event.target.value)}
								/>
							</FormField>
						)}
					</form.Field>
				))}
				{error && (
					<p role="alert" className="text-sm text-destructive">
						{error}
					</p>
				)}
				<form.Subscribe selector={(state) => state.isSubmitting}>
					{(isSubmitting) => (
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? "Creating..." : "Create hub"}
						</Button>
					)}
				</form.Subscribe>
			</form>
		</Modal>
	);
}

export function AdminHubs() {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [creating, setCreating] = useState(false);

	const query = useQuery({
		queryKey: ["hubs", "list", page],
		queryFn: () => hubsApi.list({ page, limit: 10 }),
		placeholderData: keepPreviousData,
	});

	const toggle = useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
			isActive ? hubsApi.update(id, { isActive: true }) : hubsApi.deactivate(id),
		onSuccess: async (_data, variables) => {
			toast.success(variables.isActive ? "Hub activated" : "Hub deactivated");
			await queryClient.invalidateQueries({ queryKey: ["hubs"] });
		},
		onError: (error) => toast.error(toApiError(error).message),
	});

	return (
		<>
			<div className="mb-4 flex justify-end">
				<Button onClick={() => setCreating(true)}>
					<Plus /> New hub
				</Button>
			</div>
			<CreateHubDialog open={creating} onOpenChange={setCreating} />

			<Card>
				{query.isPending ? (
					<ListSkeleton />
				) : query.isError ? (
					<ErrorState message={toApiError(query.error).message} />
				) : query.data.data.length === 0 ? (
					<EmptyState title="No hubs yet" description="Create your first hub to start routing shipments." />
				) : (
					<>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Hub</TableHead>
									<TableHead>Code</TableHead>
									<TableHead>City</TableHead>
									<TableHead>Zones</TableHead>
									<TableHead>Couriers</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{query.data.data.map((hub) => (
									<TableRow key={hub.id}>
										<TableCell>
											<Link href={`/admin/hubs/${hub.id}`} className="font-medium text-primary hover:underline">
												{hub.name}
											</Link>
										</TableCell>
										<TableCell className="font-mono text-xs">{hub.code}</TableCell>
										<TableCell>{hub.city}</TableCell>
										<TableCell>{hub._count?.zones ?? 0}</TableCell>
										<TableCell>{hub._count?.couriers ?? 0}</TableCell>
										<TableCell>
											<Badge variant={hub.isActive ? "success" : "secondary"}>
												{hub.isActive ? "Active" : "Inactive"}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<Button
												variant="outline"
												size="sm"
												disabled={toggle.isPending}
												onClick={() => toggle.mutate({ id: hub.id, isActive: !hub.isActive })}
											>
												{hub.isActive ? "Deactivate" : "Activate"}
											</Button>
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
