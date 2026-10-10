import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth";
import type { Role } from "@/types/auth.type";

/**
 * Server guard. Keep `children` inside it so a page is only rendered after
 * the role check passes. Wrap it in <Suspense> at the call site.
 * This is UX gating; the backend enforces roles on every endpoint.
 */
export async function RoleGuard({
	roles,
	children,
}: {
	roles: Role[];
	children: ReactNode;
}) {
	await requireRole(...roles);
	return <>{children}</>;
}
