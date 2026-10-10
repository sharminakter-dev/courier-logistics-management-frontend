import type { Metadata } from "next";
import { AdminShipments } from "@/components/modules/admin-shipments";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Shipments" };

export default function AdminShipmentsPage() {
	return (
		<>
			<PageHeader title="Shipments" description="Every shipment on the platform." />
			<AdminShipments />
		</>
	);
}
