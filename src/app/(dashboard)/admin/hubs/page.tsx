import type { Metadata } from "next";
import { AdminHubs } from "@/components/modules/admin-hubs";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Hubs & zones" };

export default function AdminHubsPage() {
	return (
		<>
			<PageHeader title="Hubs & zones" description="Sorting hubs and the areas they serve." />
			<AdminHubs />
		</>
	);
}
