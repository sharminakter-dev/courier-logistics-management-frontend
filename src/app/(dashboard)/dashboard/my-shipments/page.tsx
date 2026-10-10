import type { Metadata } from "next";
import { Suspense } from "react";
import { MyShipments } from "@/components/modules/my-shipments";
import { PageHeader } from "@/components/shared/PageHeader";
import { ListSkeleton } from "@/components/shared/QueryState";

export const metadata: Metadata = { title: "My shipments" };

export default function MyShipmentsPage() {
	return (
		<>
			<PageHeader title="My shipments" description="Everything you have sent so far." />
			{/* useSearchParams (payment result toast) needs a Suspense boundary */}
			<Suspense fallback={<ListSkeleton />}>
				<MyShipments />
			</Suspense>
		</>
	);
}
