import { Suspense } from "react";
import { CustomerShipmentDetail } from "@/components/modules/customer-shipment-detail";
import { PageHeader } from "@/components/shared/PageHeader";
import { ListSkeleton } from "@/components/shared/QueryState";

type Params = Promise<{ id: string }>;

async function Content({ params }: { params: Params }) {
	const { id } = await params;
	return <CustomerShipmentDetail id={id} />;
}

export default function ShipmentDetailPage({ params }: { params: Params }) {
	return (
		<>
			<PageHeader title="Shipment details" />
			<Suspense fallback={<ListSkeleton rows={6} />}>
				<Content params={params} />
			</Suspense>
		</>
	);
}
