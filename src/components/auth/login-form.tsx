"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authApi } from "@/api/auth.api";
import { FormField } from "@/components/form/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toApiError } from "@/lib/api/request";
import { homeForRole } from "@/routes";
import { type LoginValues, loginSchema } from "@/validation/auth.validation";
import { GoogleButton } from "./google-button";

const DEMO_ACCOUNTS = [
	{ label: "Admin", email: "admin@courier.com", password: "Admin@12345" },
	{ label: "Courier", email: "courier@courier.com", password: "Courier@12345" },
	{ label: "Customer", email: "customer@courier.com", password: "Customer@12345" },
];

export function LoginForm() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { email: "", password: "" } as LoginValues,
		validators: { onSubmit: loginSchema },
		onSubmit: async ({ value }) => {
			setError(null);
			try {
				const res = await authApi.login(value);
				router.replace(homeForRole(res.data.user.role));
				router.refresh();
			} catch (err) {
				setError(toApiError(err).message);
			}
		},
	});

	return (
		<div className="space-y-5">
			<form
				className="space-y-4"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					form.handleSubmit();
				}}
			>
				<form.Field name="email">
					{(field) => (
						<FormField label="Email" htmlFor="email" errors={field.state.meta.errors}>
							<Input
								id="email"
								type="email"
								autoComplete="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
							/>
						</FormField>
					)}
				</form.Field>
				<form.Field name="password">
					{(field) => (
						<FormField label="Password" htmlFor="password" errors={field.state.meta.errors}>
							<Input
								id="password"
								type="password"
								autoComplete="current-password"
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
							{isSubmitting ? "Signing in..." : "Sign in"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<GoogleButton />

			<div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
				<p className="mb-2 font-medium text-foreground">Demo accounts</p>
				<div className="flex flex-wrap gap-2">
					{DEMO_ACCOUNTS.map((account) => (
						<Button
							key={account.label}
							variant="outline"
							size="sm"
							onClick={() => {
								form.setFieldValue("email", account.email);
								form.setFieldValue("password", account.password);
							}}
						>
							{account.label}
						</Button>
					))}
				</div>
			</div>

			<p className="text-center text-sm text-muted-foreground">
				New customer?{" "}
				<Link href="/register" className="font-medium text-primary hover:underline">
					Create an account
				</Link>
			</p>
		</div>
	);
}
