import { PageHeader } from "@/components/shared/PageHeader";
import { getCurrentUser } from "@/lib/auth";

export default async function CustomerHomePage() {
	const user = await getCurrentUser();

	return <PageHeader title={`Welcome, ${user?.name}`} description="Your shipments will appear here." />;
}