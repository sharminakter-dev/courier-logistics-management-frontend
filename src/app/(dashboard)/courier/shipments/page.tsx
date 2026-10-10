import type { Metadata } from "next";
import { CourierShipments } from "@/components/modules/courier-shipments";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "My deliveries" };

export default function CourierShipmentsPage() {
	return (
		<>
			<PageHeader
				title="My deliveries"
				description="Pickups and deliveries assigned to you."
			/>
			<CourierShipments />
		</>
	);
}
