import { NotificationsList } from "@/components/modules/notifications-list";
import { PageHeader } from "@/components/shared/PageHeader";

export default function AdminNotificationsPage() {
	return (
		<>
			<PageHeader title="Notifications" description="Your latest updates." />
			<NotificationsList shipmentBasePath="/admin/shipments" />
		</>
	);
}
