import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AuthHydrator } from "@/components/auth/AuthHydrator";
import { SidebarContent } from "@/components/layout/dashboard/SidebarContent";
import { Topbar } from "@/components/layout/dashboard/Topbar";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
	title: { default: "Dashboard", template: "%s | Dashboard" },
	robots: { index: false },
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
	const user = await getCurrentUser();

	if (!user) redirect("/login");

	return (
		<div className="flex min-h-screen">
			<AuthHydrator user={user} />

			<aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
				<div className="sticky top-0 h-screen">
					<SidebarContent user={user} />
				</div>
			</aside>

			<div className="flex min-w-0 flex-1 flex-col">
				<Topbar user={user} />
				<main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
			</div>
		</div>
	);
}