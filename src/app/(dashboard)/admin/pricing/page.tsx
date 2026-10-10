import type { Metadata } from "next";
import { AdminPricing } from "@/components/modules/admin-pricing";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Pricing" };

export default function AdminPricingPage() {
	return (
		<>
			<PageHeader title="Pricing" description="Rates applied to new shipments." />
			<AdminPricing />
		</>
	);
}
