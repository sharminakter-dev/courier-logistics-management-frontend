"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { authApi } from "@/api/auth.api";
import { FormField } from "@/components/form/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";
import { toApiError } from "@/lib/api/request";
import { cn } from "@/lib/utils";
import { homeForRole } from "@/routes";
import { type RegisterValues, registerSchema } from "@/validation/auth.validation";
import { GoogleButton } from "./google-button";

function Countdown({ seconds }: { seconds: number }) {
	const [left, setLeft] = useState(seconds);

	useEffect(() => {
		setLeft(seconds);
		const timer = setInterval(() => setLeft((value) => Math.max(0, value - 1)), 1000);
		return () => clearInterval(timer);
	}, [seconds]);

	const minutes = Math.floor(left / 60);
	const rest = String(left % 60).padStart(2, "0");
	return (
		<span className={left === 0 ? "text-destructive" : undefined}>
			{left === 0 ? "Code expired" : `Expires in ${minutes}:${rest}`}
		</span>
	);
}

function OtpStep({
	email,
	expiresIn,
	onBack,
}: {
	email: string;
	expiresIn: number;
	onBack: () => void;
}) {
	const router = useRouter();
	const toast = useToast();
	const [otp, setOtp] = useState("");
	const [pending, setPending] = useState(false);

	async function verify(code: string) {
		if (code.length !== 6 || pending) return;
		setPending(true);
		try {
			const res = await authApi.verifyEmail({ email, otp: code });
			toast.success("Email verified. Welcome aboard!");
			router.replace(homeForRole(res.data.user.role));
			router.refresh();
		} catch (error) {
			toast.error(toApiError(error).message);
			setOtp("");
		} finally {
			setPending(false);
		}
	}

	return (
		<div className="space-y-5 text-center">
			<p className="text-sm text-muted-foreground">
				We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>.
			</p>
			<OTPInput
				maxLength={6}
				value={otp}
				onChange={setOtp}
				onComplete={verify}
				pattern={REGEXP_ONLY_DIGITS}
				disabled={pending}
				containerClassName="flex justify-center"
				render={({ slots }) => (
					<div className="flex gap-2">
						{slots.map((slot, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: slots are positional
								key={index}
								className={cn(
									"flex h-12 w-10 items-center justify-center rounded-lg border bg-background text-lg font-semibold",
									slot.isActive && "ring-2 ring-ring",
								)}
							>
								{slot.char}
							</div>
						))}
					</div>
				)}
			/>
			<p className="text-xs text-muted-foreground">
				<Countdown seconds={expiresIn} />
			</p>
			<Button className="w-full" disabled={otp.length !== 6 || pending} onClick={() => verify(otp)}>
				{pending ? "Verifying..." : "Verify email"}
			</Button>
			<Button variant="ghost" size="sm" onClick={onBack}>
				Use a different email
			</Button>
		</div>
	);
}

export function RegisterForm() {
	const [pendingOtp, setPendingOtp] = useState<{ email: string; expiresIn: number } | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { name: "", email: "", password: "", phone: "" } as RegisterValues,
		validators: { onSubmit: registerSchema },
		onSubmit: async ({ value }) => {
			setError(null);
			try {
				const res = await authApi.register({
					name: value.name,
					email: value.email,
					password: value.password,
					phone: value.phone || undefined,
				});
				setPendingOtp({ email: res.data.email, expiresIn: res.data.expiresInSeconds });
			} catch (err) {
				setError(toApiError(err).message);
			}
		},
	});

	if (pendingOtp) {
		return (
			<OtpStep
				email={pendingOtp.email}
				expiresIn={pendingOtp.expiresIn}
				onBack={() => setPendingOtp(null)}
			/>
		);
	}

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
				<form.Field name="name">
					{(field) => (
						<FormField label="Full name" htmlFor="name" errors={field.state.meta.errors}>
							<Input
								id="name"
								autoComplete="name"
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
								autoComplete="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
							/>
						</FormField>
					)}
				</form.Field>
				<form.Field name="phone">
					{(field) => (
						<FormField
							label="Phone (optional)"
							htmlFor="phone"
							errors={field.state.meta.errors}
						>
							<Input
								id="phone"
								type="tel"
								autoComplete="tel"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
							/>
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
							{isSubmitting ? "Sending code..." : "Create account"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<GoogleButton />

			<p className="text-center text-sm text-muted-foreground">
				Already registered?{" "}
				<Link href="/login" className="font-medium text-primary hover:underline">
					Sign in
				</Link>
			</p>
		</div>
	);
}
