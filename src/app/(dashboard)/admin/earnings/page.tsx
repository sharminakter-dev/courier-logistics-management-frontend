import type { Metadata } from "next";
import { AdminEarnings } from "@/components/modules/admin-earnings";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Courier earnings" };

export default function AdminEarningsPage() {
	return (
		<>
			<PageHeader
				title="Courier earnings"
				description="Couriers earn 70% of the price of each delivered shipment."
			/>
			<AdminEarnings />
		</>
	);
}
