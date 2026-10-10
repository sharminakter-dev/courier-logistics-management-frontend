import type { Metadata } from "next";
import { type ReactNode, Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard/DashboardShell";
import { DashboardSkeleton } from "@/components/layout/dashboard/DashboardSkeleton";

export const metadata: Metadata = {
	title: { default: "Dashboard", template: "%s | Dashboard" },
	robots: { index: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={<DashboardSkeleton />}>
			<DashboardShell>{children}</DashboardShell>
		</Suspense>
	);
}