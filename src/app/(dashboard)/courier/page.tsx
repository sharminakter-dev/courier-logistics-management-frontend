import { PageHeader } from "@/components/shared/PageHeader";
import { getCurrentUser } from "@/lib/auth";

export default async function CourierHomePage() {
	const user = await getCurrentUser();

	return <PageHeader title={`Welcome, ${user?.name}`} description="Your assigned tasks will appear here." />;
}