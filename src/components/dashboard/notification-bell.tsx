"use client";

import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import Link from "next/link";
import { notificationsApi } from "@/api/misc.api";

export function NotificationBell({ href }: { href: string }) {
	const { data } = useQuery({
		queryKey: ["notifications", "unread-count"],
		queryFn: async () => (await notificationsApi.unreadCount()).data.unreadCount,
		refetchInterval: 30_000,
	});

	return (
		<Link
			href={href}
			aria-label="Notifications"
			className="relative rounded-lg p-2 hover:bg-accent"
		>
			<Bell className="size-5" />
			{!!data && data > 0 && (
				<span className="absolute right-0.5 top-0.5 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
					{data > 99 ? "99+" : data}
				</span>
			)}
		</Link>
	);
}
