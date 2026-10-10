"use client";

import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/use-login";
import { type LoginValues, loginSchema } from "@/validation";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
	const [showPassword, setShowPassword] = useState(false);
	const login = useLogin(redirectTo);

	const busy = login.isPending || login.isSuccess;

	const form = useForm({
		defaultValues: { email: "", password: "" } satisfies LoginValues,
		validators: { onChange: loginSchema },
		onSubmit: ({ value }) => {
			login.mutate(value);
		},
	});

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Welcome back</CardTitle>
				<CardDescription>Log in to your account</CardDescription>
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
						<form.Field name="email">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Email</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											type="email"
											autoComplete="email"
											placeholder="you@example.com"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(event) => field.handleChange(event.target.value)}
											aria-invalid={isInvalid}
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="password">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Password</FieldLabel>
										<div className="relative">
											<Input
												id={field.name}
												name={field.name}
												type={showPassword ? "text" : "password"}
												autoComplete="current-password"
												placeholder="Enter your password"
												className="pr-10"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(event) =>
													field.handleChange(event.target.value)
												}
												aria-invalid={isInvalid}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
												onClick={() => setShowPassword((prev) => !prev)}
												aria-label={showPassword ? "Hide password" : "Show password"}
											>
												{showPassword ? <EyeOff /> : <Eye />}
											</Button>
										</div>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>

						<Button type="submit" className="w-full" disabled={busy}>
							{busy && <LoaderCircle className="animate-spin" />}
							Login
						</Button>
					</FieldGroup>
				</form>

				<p className="text-center text-sm text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link
						href="/register"
						className="font-medium text-primary hover:underline"
					>
						Register
					</Link>
				</p>
			</CardContent>
		</Card>
	);
}