import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth";

export default async function CourierLayout({ children }: { children: ReactNode }) {
	await requireRole("COURIER");
	return <>{children}</>;
}