import { Suspense } from "react";
import { AdminHubDetail } from "@/components/modules/admin-hub-detail";
import { PageHeader } from "@/components/shared/PageHeader";
import { ListSkeleton } from "@/components/shared/QueryState";

type Params = Promise<{ id: string }>;

async function Content({ params }: { params: Params }) {
	const { id } = await params;
	return <AdminHubDetail id={id} />;
}

export default function AdminHubDetailPage({ params }: { params: Params }) {
	return (
		<>
			<PageHeader title="Hub details" />
			<Suspense fallback={<ListSkeleton rows={5} />}>
				<Content params={params} />
			</Suspense>
		</>
	);
}
