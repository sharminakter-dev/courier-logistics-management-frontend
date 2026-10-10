import type { ReactNode } from "react";
import { Footer } from "@/components/layout/public/Footer";
import { Header } from "@/components/layout/public/Header";
import { getOptionalUser } from "@/lib/auth";

export default async function PublicLayout({ children }: { children: ReactNode }) {
	const user = await getOptionalUser();

	return (
		<div className="flex min-h-screen flex-col">
			<Header user={user} />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}