import { RecentShipments } from "@/components/modules/recent-shipments";
import { WelcomeHeader } from "@/components/shared/WelcomeHeader";

export default function CustomerHomePage() {
	return (
		<>
			<WelcomeHeader description="Your shipments will appear here." />
			<RecentShipments />
		</>
	);
}
