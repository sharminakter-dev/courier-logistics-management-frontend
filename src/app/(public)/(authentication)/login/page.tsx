import type { Metadata } from "next";
import { LoginForm } from "@/components/form/login-form";

export const metadata: Metadata = {
	title: "Login",
	description: "Log in to create, track and manage your shipments.",
};

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ redirect?: string | string[] }>;
}) {
	const { redirect } = await searchParams;

	return <LoginForm redirectTo={typeof redirect === "string" ? redirect : undefined} />;
}