import type { Metadata } from "next";
import { RegisterForm } from "@/components/form/register-form";

export const metadata: Metadata = {
	title: "Create account",
	description: "Create a free account to send and track parcels.",
};

export default function RegisterPage() {
	return <RegisterForm />;
}