import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4">
			<Skeleton className="h-96 w-full max-w-md" />
		</div>
	);
}