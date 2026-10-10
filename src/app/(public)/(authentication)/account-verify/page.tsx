import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { VerifyEmailForm } from "@/components/form/verify-email-form";

export const metadata: Metadata = {
	title: "Verify email",
	robots: { index: false },
};

export default async function AccountVerifyPage({
	searchParams,
}: {
	searchParams: Promise<{ email?: string | string[] }>;
}) {
	const { email } = await searchParams;

	if (typeof email !== "string" || email === "") {
		redirect("/register");
	}

	return <VerifyEmailForm email={email} />;
}