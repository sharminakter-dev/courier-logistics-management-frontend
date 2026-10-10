"use client";

import { useForm } from "@tanstack/react-form";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { couriersApi } from "@/api/couriers.api";
import { hubsApi } from "@/api/hubs.api";
import { FormField } from "@/components/form/form-field";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { toApiError } from "@/lib/api/request";
import type { Courier, UpdateCourierInput } from "@/types/courier.type";
import { VEHICLE_TYPES } from "@/types/courier.type";
import { labelize } from "@/utils/format";
import { adminCourierSchema } from "@/validation/auth.validation";

function useHubOptions(enabled = true) {
	return useQuery({
		queryKey: ["hubs", "options"],
		queryFn: async () => (await hubsApi.list({ limit: 100, isActive: true })).data,
		enabled,
	});
}

function CreateCourierDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [error, setError] = useState<string | null>(null);
	const hubs = useHubOptions(open);

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			phone: "",
			vehicleType: "MOTORBIKE" as (typeof VEHICLE_TYPES)[number],
			hubId: "",
		},
		validators: { onSubmit: adminCourierSchema },
		onSubmit: async ({ value }) => {
			setError(null);
			try {
				await couriersApi.create({ ...value, hubId: value.hubId || undefined });
				toast.success("Courier created and approved");
				await queryClient.invalidateQueries({ queryKey: ["couriers"] });
				form.reset();
				onOpenChange(false);
			} catch (err) {
				setError(toApiError(err).message);
			}
		},
	});

	const textFields = [
		{ name: "name", label: "Full name", type: "text" },
		{ name: "email", label: "Email", type: "email" },
		{ name: "phone", label: "Phone", type: "tel" },
		{ name: "password", label: "Password", type: "password" },
	] as const;

	return (
		<Modal
			open={open}
			onOpenChange={onOpenChange}
			title="Create courier"
			description="Admin-created couriers are approved and available immediately."
		>
			<form
				className="space-y-4"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					form.handleSubmit();
				}}
			>
				{textFields.map((item) => (
					<form.Field key={item.name} name={item.name}>
						{(field) => (
							<FormField
								label={item.label}
								htmlFor={`courier-${item.name}`}
								errors={field.state.meta.errors}
							>
								<Input
									id={`courier-${item.name}`}
									type={item.type}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(event.target.value)}
								/>
							</FormField>
						)}
					</form.Field>
				))}
				<form.Field name="vehicleType">
					{(field) => (
						<FormField label="Vehicle" htmlFor="courier-vehicle" errors={field.state.meta.errors}>
							<Select
								id="courier-vehicle"
								value={field.state.value}
								onChange={(event) =>
									field.handleChange(event.target.value as (typeof VEHICLE_TYPES)[number])
								}
							>
								{VEHICLE_TYPES.map((type) => (
									<option key={type} value={type}>
										{labelize(type)}
									</option>
								))}
							</Select>
						</FormField>
					)}
				</form.Field>
				<form.Field name="hubId">
					{(field) => (
						<FormField label="Hub (optional)" htmlFor="courier-hub" errors={field.state.meta.errors}>
							<Select
								id="courier-hub"
								value={field.state.value}
								onChange={(event) => field.handleChange(event.target.value)}
							>
								<option value="">No hub</option>
								{hubs.data?.map((hub) => (
									<option key={hub.id} value={hub.id}>
										{hub.name}
									</option>
								))}
							</Select>
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
							{isSubmitting ? "Creating..." : "Create courier"}
						</Button>
					)}
				</form.Subscribe>
			</form>
		</Modal>
	);
}

function CourierRow({ courier, hubs }: { courier: Courier; hubs: { id: string; name: string }[] }) {
	const toast = useToast();
	const queryClient = useQueryClient();

	const update = useMutation({
		mutationFn: (body: UpdateCourierInput) => couriersApi.update(courier.id, body),
		onSuccess: async () => {
			toast.success("Courier updated");
			await queryClient.invalidateQueries({ queryKey: ["couriers"] });
		},
		onError: (error) => toast.error(toApiError(error).message),
	});

	const blocked = courier.user.status === "BLOCKED";

	return (
		<TableRow>
			<TableCell>
				<p className="font-medium">{courier.user.name}</p>
				<p className="text-xs text-muted-foreground">{courier.user.email}</p>
			</TableCell>
			<TableCell>{courier.user.phone ?? "-"}</TableCell>
			<TableCell>{labelize(courier.vehicleType)}</TableCell>
			<TableCell>
				<Select
					aria-label={`Hub for ${courier.user.name}`}
					className="w-44"
					value={courier.hubId ?? ""}
					disabled={update.isPending}
					onChange={(event) => update.mutate({ hubId: event.target.value || null })}
				>
					<option value="">No hub</option>
					{hubs.map((hub) => (
						<option key={hub.id} value={hub.id}>
							{hub.name}
						</option>
					))}
				</Select>
			</TableCell>
			<TableCell>
				<div className="flex flex-wrap gap-1">
					<Badge variant={courier.isApproved ? "success" : "warning"}>
						{courier.isApproved ? "Approved" : "Pending"}
					</Badge>
					{courier.isApproved && (
						<Badge variant={courier.isAvailable ? "default" : "secondary"}>
							{courier.isAvailable ? "Available" : "Offline"}
						</Badge>
					)}
					{blocked && <Badge variant="destructive">Blocked</Badge>}
				</div>
			</TableCell>
			<TableCell className="text-right">
				<div className="flex justify-end gap-2">
					{!courier.isApproved && (
						<Button size="sm" disabled={update.isPending} onClick={() => update.mutate({ isApproved: true })}>
							Approve
						</Button>
					)}
					<Button
						size="sm"
						variant={blocked ? "outline" : "destructive"}
						disabled={update.isPending}
						onClick={() => update.mutate({ status: blocked ? "ACTIVE" : "BLOCKED" })}
					>
						{blocked ? "Unblock" : "Block"}
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
}

export function AdminCouriers() {
	const [page, setPage] = useState(1);
	const [approval, setApproval] = useState<"all" | "pending" | "approved">("all");
	const [search, setSearch] = useState("");
	const [creating, setCreating] = useState(false);
	const searchTerm = useDebouncedValue(search.trim());
	const hubs = useHubOptions();

	const query = useQuery({
		queryKey: ["couriers", "list", page, approval, searchTerm],
		queryFn: () =>
			couriersApi.list({
				page,
				limit: 10,
				isApproved: approval === "all" ? undefined : approval === "approved",
				searchTerm: searchTerm || undefined,
			}),
		placeholderData: keepPreviousData,
	});

	return (
		<>
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap gap-3">
					<div className="relative">
						<Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
						<Input
							aria-label="Search couriers"
							placeholder="Search by name or email"
							className="w-64 pl-9"
							value={search}
							onChange={(event) => {
								setSearch(event.target.value);
								setPage(1);
							}}
						/>
					</div>
					<Select
						aria-label="Filter by approval"
						className="w-40"
						value={approval}
						onChange={(event) => {
							setApproval(event.target.value as "all" | "pending" | "approved");
							setPage(1);
						}}
					>
						<option value="all">All couriers</option>
						<option value="pending">Pending approval</option>
						<option value="approved">Approved</option>
					</Select>
				</div>
				<Button onClick={() => setCreating(true)}>
					<Plus /> New courier
				</Button>
			</div>
			<CreateCourierDialog open={creating} onOpenChange={setCreating} />

			<Card>
				{query.isPending ? (
					<ListSkeleton />
				) : query.isError ? (
					<ErrorState message={toApiError(query.error).message} />
				) : query.data.data.length === 0 ? (
					<EmptyState title="No couriers found" description="Try changing the search or filter." />
				) : (
					<>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Courier</TableHead>
									<TableHead>Phone</TableHead>
									<TableHead>Vehicle</TableHead>
									<TableHead>Hub</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{query.data.data.map((courier) => (
									<CourierRow key={courier.id} courier={courier} hubs={hubs.data ?? []} />
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
