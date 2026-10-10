import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AuthHydrator } from "@/components/auth/AuthHydrator";
import { getCurrentUser } from "@/lib/auth";
import { SidebarContent } from "./SidebarContent";
import { Topbar } from "./Topbar";

export async function DashboardShell({ children }: { children: ReactNode }) {
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