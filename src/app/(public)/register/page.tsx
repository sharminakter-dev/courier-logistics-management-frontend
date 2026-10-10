import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
	return (
		<AuthCard
			title="Create your account"
			description="We will email you a code to verify your address."
		>
			<RegisterForm />
		</AuthCard>
	);
}
