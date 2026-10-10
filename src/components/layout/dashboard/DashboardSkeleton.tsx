import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
	return (
		<div className="flex min-h-screen">
			<aside className="hidden w-64 shrink-0 space-y-3 border-r p-4 lg:block">
				<Skeleton className="h-8 w-40" />
				{Array.from({ length: 6 }, (_, index) => (
					<Skeleton key={`nav-${index}`} className="h-9 w-full" />
				))}
			</aside>
			<main className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
				<Skeleton className="h-8 w-56" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-64 w-full" />
			</main>
		</div>
	);
}