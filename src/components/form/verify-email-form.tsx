"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { LoaderCircle } from "lucide-react";
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
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { useVerifyEmail } from "@/hooks/use-verify-email";
import { verifyEmailSchema } from "@/validation";

export function VerifyEmailForm({ email }: { email: string }) {
	const [otp, setOtp] = useState("");
	const [error, setError] = useState<string | null>(null);
	const verify = useVerifyEmail();

	const busy = verify.isPending || verify.isSuccess;

	const submit = (code: string) => {
		const parsed = verifyEmailSchema.safeParse({ email, otp: code });

		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message ?? "Invalid code");
			return;
		}

		setError(null);
		verify.mutate(parsed.data, { onError: () => setOtp("") });
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Verify your email</CardTitle>
				<CardDescription>
					Enter the 6-digit code we sent to <strong>{email}</strong>. It expires in 5 minutes.
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				<div className="flex flex-col items-center gap-3">
					<InputOTP
						maxLength={6}
						pattern={REGEXP_ONLY_DIGITS}
						value={otp}
						onChange={(value) => {
							setOtp(value);
							setError(null);
						}}
						onComplete={submit}
						disabled={busy}
						aria-label="One-time code"
					>
						<InputOTPGroup>
							{[0, 1, 2, 3, 4, 5].map((index) => (
								<InputOTPSlot key={index} index={index} />
							))}
						</InputOTPGroup>
					</InputOTP>

					{error && (
						<p role="alert" className="text-sm text-destructive">
							{error}
						</p>
					)}
				</div>

				<Button className="w-full" disabled={busy || otp.length < 6} onClick={() => submit(otp)}>
					{busy && <LoaderCircle className="animate-spin" />}
					Verify email
				</Button>

				<p className="text-center text-sm text-muted-foreground">
					Code expired or too many attempts?{" "}
					<Link href="/register" className="font-medium text-primary hover:underline">
						Register again
					</Link>
				</p>
			</CardContent>
		</Card>
	);
}