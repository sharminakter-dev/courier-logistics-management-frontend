"use client";

import { useUrlState } from "@/hooks/use-url-state";
import { Button } from "@/components/ui/button";
import type { ApiMeta } from "@/types/api";

export function Pagination({ meta }: { meta: ApiMeta }) {
	const { set } = useUrlState();

	if (meta.totalPages <= 1) return null;

	return (
		<nav
			aria-label="Pagination"
			className="mt-4 flex items-center justify-between gap-3"
		>
			<p className="text-sm text-muted-foreground">
				Page {meta.page} of {meta.totalPages} &middot; {meta.total} results
			</p>
			<div className="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={meta.page <= 1}
					onClick={() => set({ page: meta.page - 1 })}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={meta.page >= meta.totalPages}
					onClick={() => set({ page: meta.page + 1 })}
				>
					Next
				</Button>
			</div>
		</nav>
	);
}