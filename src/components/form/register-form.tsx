"use client";

import { useForm } from "@tanstack/react-form";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useRegister } from "@/hooks/use-register";
import { type RegisterValues, registerSchema } from "@/validation";
import { FormTextField } from "./form-text-field";

export function RegisterForm() {
	const register = useRegister();
	const busy = register.isPending || register.isSuccess;

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			password: "",
			confirmPassword: "",
		} satisfies RegisterValues,
		validators: { onChange: registerSchema },
		onSubmit: ({ value }) => {
			register.mutate({
				name: value.name.trim(),
				email: value.email.trim(),
				password: value.password,
				phone: value.phone.trim() || undefined,
			});
		},
	});

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Create your account</CardTitle>
				<CardDescription>
					We&apos;ll email you a code to verify your address
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				<form
					noValidate
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field name="name">
							{(field) => (
								<FormTextField
									label="Full name"
									name={field.name}
									autoComplete="name"
									placeholder="Rahim Uddin"
									value={field.state.value}
									onValueChange={field.handleChange}
									onBlur={field.handleBlur}
									errors={field.state.meta.errors}
									showError={field.state.meta.isTouched && !field.state.meta.isValid}
								/>
							)}
						</form.Field>

						<form.Field name="email">
							{(field) => (
								<FormTextField
									label="Email"
									name={field.name}
									type="email"
									autoComplete="email"
									placeholder="you@example.com"
									value={field.state.value}
									onValueChange={field.handleChange}
									onBlur={field.handleBlur}
									errors={field.state.meta.errors}
									showError={field.state.meta.isTouched && !field.state.meta.isValid}
								/>
							)}
						</form.Field>

						<form.Field name="phone">
							{(field) => (
								<FormTextField
									label="Phone (optional)"
									name={field.name}
									type="tel"
									autoComplete="tel"
									placeholder="01712345678"
									value={field.state.value}
									onValueChange={field.handleChange}
									onBlur={field.handleBlur}
									errors={field.state.meta.errors}
									showError={field.state.meta.isTouched && !field.state.meta.isValid}
								/>
							)}
						</form.Field>

						<form.Field name="password">
							{(field) => (
								<FormTextField
									isPassword
									label="Password"
									name={field.name}
									autoComplete="new-password"
									placeholder="At least 8 characters"
									description="Use upper and lower case letters and a number."
									value={field.state.value}
									onValueChange={field.handleChange}
									onBlur={field.handleBlur}
									errors={field.state.meta.errors}
									showError={field.state.meta.isTouched && !field.state.meta.isValid}
								/>
							)}
						</form.Field>

						<form.Field name="confirmPassword">
							{(field) => (
								<FormTextField
									isPassword
									label="Confirm password"
									name={field.name}
									autoComplete="new-password"
									placeholder="Repeat your password"
									value={field.state.value}
									onValueChange={field.handleChange}
									onBlur={field.handleBlur}
									errors={field.state.meta.errors}
									showError={field.state.meta.isTouched && !field.state.meta.isValid}
								/>
							)}
						</form.Field>

						<Button type="submit" className="w-full" disabled={busy}>
							{busy && <LoaderCircle className="animate-spin" />}
							Create account
						</Button>
					</FieldGroup>
				</form>

				<p className="text-center text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link href="/login" className="font-medium text-primary hover:underline">
						Login
					</Link>
				</p>
			</CardContent>
		</Card>
	);
}