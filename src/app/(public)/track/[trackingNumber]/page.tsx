import { Suspense } from "react";
import { TrackForm } from "@/components/modules/track-form";
import { TrackingResult } from "@/components/modules/tracking-result";
import { ListSkeleton } from "@/components/shared/QueryState";

type Params = Promise<{ trackingNumber: string }>;

async function Content({ params }: { params: Params }) {
	const { trackingNumber } = await params;
	const decoded = decodeURIComponent(trackingNumber);
	return (
		<>
			<TrackForm initial={decoded} />
			<TrackingResult trackingNumber={decoded} />
		</>
	);
}

export default function TrackingPage({ params }: { params: Params }) {
	return (
		<div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
			<h1 className="text-2xl font-semibold tracking-tight">Shipment tracking</h1>
			<Suspense fallback={<ListSkeleton rows={4} />}>
				<Content params={params} />
			</Suspense>
		</div>
	);
}
