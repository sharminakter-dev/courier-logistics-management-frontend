"use client";

import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { pricingApi } from "@/api/misc.api";
import { FormField } from "@/components/form/form-field";
import { ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";
import { toApiError } from "@/lib/api/request";
import type { Pricing } from "@/types/misc.type";
import { formatDateTime } from "@/utils/format";
import { type PricingFormValues, pricingSchema } from "@/validation/shipment.validation";

const FIELDS = [
	{ name: "sameCityBase", label: "Same city base (BDT)", step: "1" },
	{ name: "interCityBase", label: "Between cities base (BDT)", step: "1" },
	{ name: "freeWeightKg", label: "Free weight (kg)", step: "0.1" },
	{ name: "perExtraKg", label: "Price per extra kg (BDT)", step: "1" },
	{ name: "expressMultiplier", label: "Express multiplier (1 to 5)", step: "0.1" },
] as const;

function PricingForm({ pricing }: { pricing: Pricing }) {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: {
			sameCityBase: Number(pricing.sameCityBase),
			interCityBase: Number(pricing.interCityBase),
			freeWeightKg: Number(pricing.freeWeightKg),
			perExtraKg: Number(pricing.perExtraKg),
			expressMultiplier: Number(pricing.expressMultiplier),
		} as PricingFormValues,
		validators: { onSubmit: pricingSchema },
		onSubmit: async ({ value }) => {
			setError(null);
			try {
				await pricingApi.update(value);
				toast.success("Pricing updated");
				await queryClient.invalidateQueries({ queryKey: ["pricing"] });
				await queryClient.invalidateQueries({ queryKey: ["quote"] });
			} catch (err) {
				setError(toApiError(err).message);
			}
		},
	});

	return (
		<form
			className="space-y-4"
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				form.handleSubmit();
			}}
		>
			<div className="grid gap-4 sm:grid-cols-2">
				{FIELDS.map((item) => (
					<form.Field key={item.name} name={item.name}>
						{(field) => (
							<FormField
								label={item.label}
								htmlFor={`pricing-${item.name}`}
								errors={field.state.meta.errors}
							>
								<Input
									id={`pricing-${item.name}`}
									type="number"
									step={item.step}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(Number(event.target.value))}
								/>
							</FormField>
						)}
					</form.Field>
				))}
			</div>
			{error && (
				<p role="alert" className="text-sm text-destructive">
					{error}
				</p>
			)}
			<form.Subscribe selector={(state) => state.isSubmitting}>
				{(isSubmitting) => (
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : "Save pricing"}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}

export function AdminPricing() {
	const query = useQuery({
		queryKey: ["pricing"],
		queryFn: async () => (await pricingApi.get()).data,
	});

	if (query.isPending) return <ListSkeleton rows={4} />;
	if (query.isError) return <ErrorState message={toApiError(query.error).message} />;

	return (
		<Card className="max-w-2xl">
			<CardHeader>
				<CardTitle>Pricing rule</CardTitle>
				<CardDescription>
					Saving creates a new active rule and keeps the old one as history. Existing shipments keep
					their price. Active since {formatDateTime(query.data.createdAt)}.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{/* key remounts the form with fresh defaults after a save */}
				<PricingForm key={query.data.id} pricing={query.data} />
			</CardContent>
		</Card>
	);
}
