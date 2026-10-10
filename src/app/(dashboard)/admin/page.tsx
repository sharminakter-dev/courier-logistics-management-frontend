import { PageHeader } from "@/components/shared/PageHeader";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminHomePage() {
	const user = await getCurrentUser();

	return <PageHeader title={`Welcome, ${user?.name}`} description="Platform analytics will appear here." />;
}