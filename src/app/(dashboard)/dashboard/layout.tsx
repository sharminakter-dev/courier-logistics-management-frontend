import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth";

export default async function CustomerLayout({ children }: { children: ReactNode }) {
	await requireRole("CUSTOMER");
	return <>{children}</>;
}