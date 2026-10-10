import type { Metadata } from "next";
import { NewShipmentForm } from "@/components/modules/new-shipment-form";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "New shipment" };

export default function NewShipmentPage() {
	return (
		<>
			<PageHeader
				title="New shipment"
				description="Enter the details, review the price and pay with bKash."
			/>
			<NewShipmentForm />
		</>
	);
}
