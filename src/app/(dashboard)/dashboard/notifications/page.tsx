import { NotificationsList } from "@/components/modules/notifications-list";
import { PageHeader } from "@/components/shared/PageHeader";

export default function CustomerNotificationsPage() {
	return (
		<>
			<PageHeader title="Notifications" description="Updates about your shipments." />
			<NotificationsList shipmentBasePath="/dashboard/my-shipments" />
		</>
	);
}
