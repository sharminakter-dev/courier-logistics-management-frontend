import { Skeleton } from "@/components/ui/skeleton";

/** Fallback while the session is checked: mirrors the dashboard chrome. */
export function AuthLoading() {
	return (
		<div className="flex min-h-screen">
			<aside className="hidden w-64 shrink-0 border-r bg-sidebar p-4 md:block">
				<Skeleton className="mb-6 h-8 w-40" />
				<div className="space-y-2">
					{Array.from({ length: 6 }, (_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows
						<Skeleton key={index} className="h-9 w-full" />
					))}
				</div>
			</aside>
			<div className="flex-1">
				<div className="h-14 border-b bg-card" />
				<div className="space-y-4 p-6">
					<Skeleton className="h-8 w-56" />
					<Skeleton className="h-64 w-full" />
				</div>
			</div>
		</div>
	);
}
