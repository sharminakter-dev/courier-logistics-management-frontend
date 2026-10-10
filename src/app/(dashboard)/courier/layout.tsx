import { type ReactNode, Suspense } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageSkeleton } from "@/components/shared/QueryState";

export default function CourierLayout({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={<PageSkeleton />}>
			<RoleGuard roles={["COURIER"]}>{children}</RoleGuard>
		</Suspense>
	);
}
