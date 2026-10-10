"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { hubsApi } from "@/api/hubs.api";
import { FormField } from "@/components/form/form-field";
import { DetailRow } from "@/components/shared/DetailRow";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";
import { toApiError } from "@/lib/api/request";
import { zoneSchema } from "@/validation/shipment.validation";

function AddZoneDialog({
	hubId,
	open,
	onOpenChange,
}: {
	hubId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { name: "", areas: "" },
		validators: { onSubmit: zoneSchema },
		onSubmit: async ({ value }) => {
			setError(null);
			const areas = value.areas
				.split(",")
				.map((area) => area.trim())
				.filter(Boolean);
			try {
				await hubsApi.createZone(hubId, { name: value.name, areas });
				toast.success("Zone created");
				await queryClient.invalidateQueries({ queryKey: ["hub", hubId] });
				form.reset();
				onOpenChange(false);
			} catch (err) {
				setError(toApiError(err).message);
			}
		},
	});

	return (
		<Modal open={open} onOpenChange={onOpenChange} title="Add zone">
			<form
				className="space-y-4"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					form.handleSubmit();
				}}
			>
				<form.Field name="name">
					{(field) => (
						<FormField label="Zone name" htmlFor="zone-name" errors={field.state.meta.errors}>
							<Input
								id="zone-name"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
							/>
						</FormField>
					)}
				</form.Field>
				<form.Field name="areas">
					{(field) => (
						<FormField
							label="Areas"
							htmlFor="zone-areas"
							hint="Separate with commas, e.g. Kolatoli, Laboni, Sugandha"
							errors={field.state.meta.errors}
						>
							<Input
								id="zone-areas"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
							/>
						</FormField>
					)}
				</form.Field>
				{error && (
					<p role="alert" className="text-sm text-destructive">
						{error}
					</p>
				)}
				<form.Subscribe selector={(state) => state.isSubmitting}>
					{(isSubmitting) => (
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? "Adding..." : "Add zone"}
						</Button>
					)}
				</form.Subscribe>
			</form>
		</Modal>
	);
}

export function AdminHubDetail({ id }: { id: string }) {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [adding, setAdding] = useState(false);

	const query = useQuery({
		queryKey: ["hub", id],
		queryFn: async () => (await hubsApi.get(id)).data,
	});

	const refresh = () => queryClient.invalidateQueries({ queryKey: ["hub", id] });

	const toggleZone = useMutation({
		mutationFn: ({ zoneId, isActive }: { zoneId: string; isActive: boolean }) =>
			hubsApi.updateZone(zoneId, { isActive }),
		onSuccess: refresh,
		onError: (error) => toast.error(toApiError(error).message),
	});

	const removeZone = useMutation({
		mutationFn: (zoneId: string) => hubsApi.deleteZone(zoneId),
		onSuccess: async () => {
			toast.success("Zone deleted");
			await refresh();
		},
		onError: (error) => toast.error(toApiError(error).message),
	});

	if (query.isPending) return <ListSkeleton rows={5} />;
	if (query.isError) return <ErrorState message={toApiError(query.error).message} />;

	const hub = query.data;
	const zones = hub.zones ?? [];

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex-row items-center justify-between">
					<CardTitle>
						{hub.name} <span className="font-mono text-sm text-muted-foreground">({hub.code})</span>
					</CardTitle>
					<Badge variant={hub.isActive ? "success" : "secondary"}>
						{hub.isActive ? "Active" : "Inactive"}
					</Badge>
				</CardHeader>
				<CardContent>
					<dl className="divide-y">
						<DetailRow label="City">{hub.city}</DetailRow>
						<DetailRow label="Address">{hub.address}</DetailRow>
						<DetailRow label="Phone">{hub.phone || "-"}</DetailRow>
						<DetailRow label="Couriers">{hub._count?.couriers ?? 0}</DetailRow>
					</dl>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex-row items-center justify-between">
					<CardTitle>Zones</CardTitle>
					<Button size="sm" onClick={() => setAdding(true)}>
						<Plus /> Add zone
					</Button>
				</CardHeader>
				<AddZoneDialog hubId={id} open={adding} onOpenChange={setAdding} />
				{zones.length === 0 ? (
					<EmptyState title="No zones yet" description="Zones group the areas a hub serves." />
				) : (
					<ul className="divide-y">
						{zones.map((zone) => (
							<li key={zone.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
								<div className="min-w-0">
									<p className="font-medium">{zone.name}</p>
									<p className="text-sm text-muted-foreground">{zone.areas.join(", ")}</p>
								</div>
								<div className="flex items-center gap-2">
									<Badge variant={zone.isActive ? "success" : "secondary"}>
										{zone.isActive ? "Active" : "Inactive"}
									</Badge>
									<Button
										variant="outline"
										size="sm"
										disabled={toggleZone.isPending}
										onClick={() => toggleZone.mutate({ zoneId: zone.id, isActive: !zone.isActive })}
									>
										{zone.isActive ? "Disable" : "Enable"}
									</Button>
									<Button
										variant="ghost"
										size="icon"
										aria-label={`Delete ${zone.name}`}
										disabled={removeZone.isPending}
										onClick={() => {
											if (window.confirm(`Delete zone "${zone.name}" permanently?`)) {
												removeZone.mutate(zone.id);
											}
										}}
									>
										<Trash2 className="text-destructive" />
									</Button>
								</div>
							</li>
						))}
					</ul>
				)}
			</Card>
		</div>
	);
}
