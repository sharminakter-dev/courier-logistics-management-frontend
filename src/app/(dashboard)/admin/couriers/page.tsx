import type { Metadata } from "next";
import { AdminCouriers } from "@/components/modules/admin-couriers";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Couriers" };

export default function AdminCouriersPage() {
	return (
		<>
			<PageHeader
				title="Couriers"
				description="Approve applications, assign hubs and manage access."
			/>
			<AdminCouriers />
		</>
	);
}
