import { type ReactNode, Suspense } from "react";
import { AuthLoading } from "@/components/auth/auth-loading";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireUser } from "@/lib/auth";

async function Shell({ children }: { children: ReactNode }) {
	const user = await requireUser();
	return <DashboardShell user={user}>{children}</DashboardShell>;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={<AuthLoading />}>
			<Shell>{children}</Shell>
		</Suspense>
	);
}
