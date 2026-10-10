import { AdminOverview } from "@/components/modules/admin-overview";
import { WelcomeHeader } from "@/components/shared/WelcomeHeader";

export default function AdminHomePage() {
	return (
		<>
			<WelcomeHeader description="Platform analytics at a glance." />
			<AdminOverview />
		</>
	);
}
