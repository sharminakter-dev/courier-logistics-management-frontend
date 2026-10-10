import { AlertCircle, Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<div className="space-y-2 p-4">
			{Array.from({ length: rows }, (_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows
				<Skeleton key={index} className="h-10 w-full" />
			))}
		</div>
	);
}

export function ErrorState({ message }: { message: string }) {
	return (
		<div className="flex flex-col items-center gap-2 p-10 text-center">
			<AlertCircle className="size-8 text-destructive" />
			<p className="text-sm text-muted-foreground">{message}</p>
		</div>
	);
}

export function EmptyState({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: ReactNode;
}) {
	return (
		<div className="flex flex-col items-center gap-2 p-10 text-center">
			<Inbox className="size-8 text-muted-foreground" />
			<p className="font-medium">{title}</p>
			{description && (
				<p className="text-sm text-muted-foreground">{description}</p>
			)}
			{action}
		</div>
	);
}

export function PageSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-8 w-56" />
			<Skeleton className="h-4 w-80" />
			<Skeleton className="h-64 w-full" />
		</div>
	);
}
