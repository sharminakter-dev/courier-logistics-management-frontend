import { NotificationsList } from "@/components/modules/notifications-list";
import { PageHeader } from "@/components/shared/PageHeader";

export default function CourierNotificationsPage() {
	return (
		<>
			<PageHeader title="Notifications" description="Assignments and payouts." />
			<NotificationsList />
		</>
	);
}
