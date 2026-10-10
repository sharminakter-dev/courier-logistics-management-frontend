import type { Metadata } from "next";
import { CourierEarnings } from "@/components/modules/courier-earnings";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Earnings" };

export default function CourierEarningsPage() {
	return (
		<>
			<PageHeader title="Earnings" description="Your share of delivered shipments." />
			<CourierEarnings />
		</>
	);
}
