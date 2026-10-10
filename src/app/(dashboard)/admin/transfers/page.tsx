import type { Metadata } from "next";
import { AdminTransfers } from "@/components/modules/admin-transfers";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Hub transfers" };

export default function AdminTransfersPage() {
	return (
		<>
			<PageHeader
				title="Hub transfers"
				description="Dispatch shipments between hubs and confirm their arrival."
			/>
			<AdminTransfers />
		</>
	);
}
