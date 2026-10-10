import { CourierProfileView } from "@/components/modules/courier-profile";
import { WelcomeHeader } from "@/components/shared/WelcomeHeader";

export default function CourierHomePage() {
	return (
		<>
			<WelcomeHeader description="Your profile, availability and delivery stats." />
			<CourierProfileView />
		</>
	);
}
