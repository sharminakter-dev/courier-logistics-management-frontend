import { Suspense } from "react";
import { AdminShipmentDetail } from "@/components/modules/admin-shipment-detail";
import { PageHeader } from "@/components/shared/PageHeader";
import { ListSkeleton } from "@/components/shared/QueryState";

type Params = Promise<{ id: string }>;

async function Content({ params }: { params: Params }) {
	const { id } = await params;
	return <AdminShipmentDetail id={id} />;
}

export default function AdminShipmentDetailPage({ params }: { params: Params }) {
	return (
		<>
			<PageHeader title="Shipment details" />
			<Suspense fallback={<ListSkeleton rows={6} />}>
				<Content params={params} />
			</Suspense>
		</>
	);
}
