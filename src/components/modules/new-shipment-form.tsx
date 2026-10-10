"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { pricingApi } from "@/api/misc.api";
import { shipmentsApi } from "@/api/shipments.api";
import { FormField } from "@/components/form/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toApiError } from "@/lib/api/request";
import { formatCurrency } from "@/utils/format";
import { type ShipmentFormValues, shipmentSchema } from "@/validation/shipment.validation";

const PARTY_FIELDS = [
	{ key: "name", label: "Name", type: "text" },
	{ key: "phone", label: "Phone", type: "tel" },
	{ key: "address", label: "Address", type: "text" },
	{ key: "city", label: "City", type: "text" },
] as const;

export function NewShipmentForm() {
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: {
			pickup: { name: "", phone: "", address: "", city: "" },
			receiver: { name: "", phone: "", address: "", city: "" },
			weightKg: 1,
			deliveryType: "STANDARD",
			parcelDescription: "",
			pickupScheduledAt: "",
		} as ShipmentFormValues,
		validators: { onSubmit: shipmentSchema },
		onSubmit: async ({ value }) => {
			setError(null);
			try {
				const res = await shipmentsApi.create({
					pickup: value.pickup,
					receiver: value.receiver,
					weightKg: value.weightKg,
					deliveryType: value.deliveryType,
					parcelDescription: value.parcelDescription || undefined,
					pickupScheduledAt: value.pickupScheduledAt
						? new Date(value.pickupScheduledAt).toISOString()
						: undefined,
				});
				// Hand over to bKash. The backend redirects back to /dashboard/my-shipments.
				window.location.href = res.data.paymentUrl;
			} catch (err) {
				setError(toApiError(err).message);
			}
		},
	});

	const values = useStore(form.store, (state) => state.values);
	const quoteReady =
		values.pickup.city.trim().length >= 2 &&
		values.receiver.city.trim().length >= 2 &&
		values.weightKg > 0 &&
		values.weightKg <= 50;

	const quote = useQuery({
		queryKey: [
			"quote",
			values.pickup.city,
			values.receiver.city,
			values.weightKg,
			values.deliveryType,
		],
		queryFn: async () =>
			(
				await pricingApi.quote({
					pickupCity: values.pickup.city.trim(),
					receiverCity: values.receiver.city.trim(),
					weightKg: values.weightKg,
					deliveryType: values.deliveryType,
				})
			).data,
		enabled: quoteReady,
	});

	const renderParty = (prefix: "pickup" | "receiver", title: string) => (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-4 sm:grid-cols-2">
				{PARTY_FIELDS.map((item) => (
					<form.Field key={item.key} name={`${prefix}.${item.key}` as const}>
						{(field) => (
							<div className={item.key === "address" ? "sm:col-span-2" : undefined}>
								<FormField
									label={item.label}
									htmlFor={`${prefix}-${item.key}`}
									errors={field.state.meta.errors}
								>
									<Input
										id={`${prefix}-${item.key}`}
										type={item.type}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
									/>
								</FormField>
							</div>
						)}
					</form.Field>
				))}
			</CardContent>
		</Card>
	);

	return (
		<form
			className="grid gap-6 lg:grid-cols-[1fr_320px]"
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				form.handleSubmit();
			}}
		>
			<div className="space-y-6">
				{renderParty("pickup", "Pickup details")}
				{renderParty("receiver", "Receiver details")}

				<Card>
					<CardHeader>
						<CardTitle>Parcel</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4 sm:grid-cols-2">
						<form.Field name="weightKg">
							{(field) => (
								<FormField label="Weight (kg)" htmlFor="weight" errors={field.state.meta.errors}>
									<Input
										id="weight"
										type="number"
										min="0.1"
										max="50"
										step="0.1"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(Number(event.target.value))}
									/>
								</FormField>
							)}
						</form.Field>
						<form.Field name="deliveryType">
							{(field) => (
								<FormField label="Service" htmlFor="service" errors={field.state.meta.errors}>
									<Select
										id="service"
										value={field.state.value}
										onChange={(event) =>
											field.handleChange(event.target.value as ShipmentFormValues["deliveryType"])
										}
									>
										<option value="STANDARD">Standard</option>
										<option value="EXPRESS">Express</option>
									</Select>
								</FormField>
							)}
						</form.Field>
						<form.Field name="pickupScheduledAt">
							{(field) => (
								<FormField
									label="Pickup time (optional)"
									htmlFor="scheduled"
									errors={field.state.meta.errors}
								>
									<Input
										id="scheduled"
										type="datetime-local"
										value={field.state.value}
										onChange={(event) => field.handleChange(event.target.value)}
									/>
								</FormField>
							)}
						</form.Field>
						<div className="sm:col-span-2">
							<form.Field name="parcelDescription">
								{(field) => (
									<FormField
										label="Description (optional)"
										htmlFor="description"
										errors={field.state.meta.errors}
									>
										<Textarea
											id="description"
											maxLength={500}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(event) => field.handleChange(event.target.value)}
										/>
									</FormField>
								)}
							</form.Field>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="lg:sticky lg:top-20 lg:self-start">
				<Card>
					<CardHeader>
						<CardTitle>Order summary</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-sm text-muted-foreground">Estimated total</p>
							<p className="text-3xl font-semibold">
								{quote.data ? formatCurrency(quote.data.total) : "-"}
							</p>
						</div>
						{quote.data && (
							<dl className="space-y-1 text-sm">
								<div className="flex justify-between">
									<dt className="text-muted-foreground">Base</dt>
									<dd>{formatCurrency(quote.data.base)}</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-muted-foreground">Extra weight ({quote.data.extraKg} kg)</dt>
									<dd>{formatCurrency(quote.data.extraCharge)}</dd>
								</div>
								{quote.data.multiplier !== 1 && (
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Express</dt>
										<dd>x {quote.data.multiplier}</dd>
									</div>
								)}
							</dl>
						)}
						{!quoteReady && (
							<p className="text-xs text-muted-foreground">
								Enter both cities and the weight to see the price.
							</p>
						)}
						{error && (
							<p role="alert" className="text-sm text-destructive">
								{error}
							</p>
						)}
						<form.Subscribe selector={(state) => state.isSubmitting}>
							{(isSubmitting) => (
								<Button type="submit" className="w-full" disabled={isSubmitting}>
									{isSubmitting ? "Creating..." : "Create and pay with bKash"}
								</Button>
							)}
						</form.Subscribe>
					</CardContent>
				</Card>
			</div>
		</form>
	);
}
