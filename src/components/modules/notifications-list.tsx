"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { notificationsApi } from "@/api/misc.api";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toaster";
import { toApiError } from "@/lib/api/request";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/format";

type NotificationsListProps = {
	/** Shipment detail prefix for linking, e.g. /admin/shipments. Omit for no link. */
	shipmentBasePath?: string;
};

export function NotificationsList({ shipmentBasePath }: NotificationsListProps) {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [filter, setFilter] = useState<"all" | "unread">("all");

	const query = useQuery({
		queryKey: ["notifications", "list", page, filter],
		queryFn: () =>
			notificationsApi.list({ page, limit: 10, isRead: filter === "unread" ? false : undefined }),
		placeholderData: keepPreviousData,
	});

	async function refresh() {
		await queryClient.invalidateQueries({ queryKey: ["notifications"] });
	}

	const markOne = useMutation({
		mutationFn: (id: string) => notificationsApi.markRead(id),
		onSuccess: refresh,
		onError: (error) => toast.error(toApiError(error).message),
	});

	const markAll = useMutation({
		mutationFn: () => notificationsApi.markAllRead(),
		onSuccess: refresh,
		onError: (error) => toast.error(toApiError(error).message),
	});

	return (
		<Card>
			<div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
				<Select
					aria-label="Filter notifications"
					className="w-40"
					value={filter}
					onChange={(event) => {
						setFilter(event.target.value as "all" | "unread");
						setPage(1);
					}}
				>
					<option value="all">All</option>
					<option value="unread">Unread only</option>
				</Select>
				<Button variant="outline" size="sm" disabled={markAll.isPending} onClick={() => markAll.mutate()}>
					<CheckCheck /> Mark all as read
				</Button>
			</div>

			{query.isPending ? (
				<ListSkeleton />
			) : query.isError ? (
				<ErrorState message={toApiError(query.error).message} />
			) : query.data.data.length === 0 ? (
				<EmptyState title="You are all caught up" description="New notifications will show up here." />
			) : (
				<>
					<ul className="divide-y">
						{query.data.data.map((item) => (
							<li
								key={item.id}
								className={cn("flex items-start gap-3 p-4", !item.isRead && "bg-accent/40")}
							>
								<span
									className={cn(
										"mt-1.5 size-2 shrink-0 rounded-full",
										item.isRead ? "bg-transparent" : "bg-primary",
									)}
								/>
								<div className="min-w-0 flex-1">
									<p className="text-sm font-medium">{item.title}</p>
									<p className="text-sm text-muted-foreground">{item.message}</p>
									<div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
										<span>{formatDateTime(item.createdAt)}</span>
										{shipmentBasePath && item.shipmentId && (
											<Link
												href={`${shipmentBasePath}/${item.shipmentId}`}
												className="font-medium text-primary hover:underline"
											>
												View shipment
											</Link>
										)}
									</div>
								</div>
								{!item.isRead && (
									<Button
										variant="ghost"
										size="sm"
										disabled={markOne.isPending}
										onClick={() => markOne.mutate(item.id)}
									>
										Mark read
									</Button>
								)}
							</li>
						))}
					</ul>
					<Pagination meta={query.data.meta} onPageChange={setPage} />
				</>
			)}
		</Card>
	);
}
