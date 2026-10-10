"use client";

import { useForm } from "@tanstack/react-form";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { couriersApi } from "@/api/couriers.api";
import { FormField } from "@/components/form/form-field";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toApiError } from "@/lib/api/request";
import { cn } from "@/lib/utils";
import { VEHICLE_TYPES } from "@/types/courier.type";
import { labelize } from "@/utils/format";
import {
	type CourierRegisterValues,
	courierRegisterSchema,
} from "@/validation/auth.validation";

export function CourierRegisterForm() {
	const [done, setDone] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			phone: "",
			vehicleType: "MOTORBIKE",
		} as CourierRegisterValues,
		validators: { onSubmit: courierRegisterSchema },
		onSubmit: async ({ value }) => {
			setError(null);
			try {
				await couriersApi.register(value);
				setDone(true);
			} catch (err) {
				setError(toApiError(err).message);
			}
		},
	});

	if (done) {
		return (
			<div className="space-y-4 text-center">
				<CheckCircle2 className="mx-auto size-10 text-green-600" />
				<p className="font-medium">Application submitted</p>
				<p className="text-sm text-muted-foreground">
					An admin will review your account. You can sign in now, but you cannot go online or
					receive shipments until you are approved.
				</p>
				<Link href="/login" className={cn(buttonVariants(), "w-full")}>
					Go to sign in
				</Link>
			</div>
		);
	}

	return (
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
					<FormField label="Full name" htmlFor="name" errors={field.state.meta.errors}>
						<Input
							id="name"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(event) => field.handleChange(event.target.value)}
						/>
					</FormField>
				)}
			</form.Field>
			<form.Field name="email">
				{(field) => (
					<FormField label="Email" htmlFor="email" errors={field.state.meta.errors}>
						<Input
							id="email"
							type="email"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(event) => field.handleChange(event.target.value)}
						/>
					</FormField>
				)}
			</form.Field>
			<form.Field name="phone">
				{(field) => (
					<FormField label="Phone" htmlFor="phone" errors={field.state.meta.errors}>
						<Input
							id="phone"
							type="tel"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(event) => field.handleChange(event.target.value)}
						/>
					</FormField>
				)}
			</form.Field>
			<form.Field name="vehicleType">
				{(field) => (
					<FormField label="Vehicle" htmlFor="vehicle" errors={field.state.meta.errors}>
						<Select
							id="vehicle"
							value={field.state.value}
							onChange={(event) =>
								field.handleChange(event.target.value as CourierRegisterValues["vehicleType"])
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
			<form.Field name="password">
				{(field) => (
					<FormField
						label="Password"
						htmlFor="password"
						hint="8 to 64 characters with upper, lower case and a number"
						errors={field.state.meta.errors}
					>
						<Input
							id="password"
							type="password"
							autoComplete="new-password"
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
						{isSubmitting ? "Submitting..." : "Apply as courier"}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}
