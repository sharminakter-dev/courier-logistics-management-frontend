import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { CourierRegisterForm } from "@/components/auth/courier-register-form";

export const metadata: Metadata = { title: "Become a courier" };

export default function CourierSignupPage() {
	return (
		<AuthCard
			title="Become a courier"
			description="Apply to deliver parcels. An admin approves every account."
		>
			<CourierRegisterForm />
		</AuthCard>
	);
}
