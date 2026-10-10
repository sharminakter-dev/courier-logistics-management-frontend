import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { getCurrentUser } from "@/lib/auth";

async function UserWelcome({ description }: { description: string }) {
	const user = await getCurrentUser();
	return <PageHeader title={`Welcome, ${user?.name ?? ""}`} description={description} />;
}

/** Suspends only the user lookup so the rest of the page renders instantly. */
export function WelcomeHeader({ description }: { description: string }) {
	return (
		<Suspense fallback={<PageHeader title="Welcome" description={description} />}>
			<UserWelcome description={description} />
		</Suspense>
	);
}
