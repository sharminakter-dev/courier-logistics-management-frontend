"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Meta } from "@/types/api.type";

type PaginationProps = {
	meta?: Meta;
	onPageChange: (page: number) => void;
};

export function Pagination({ meta, onPageChange }: PaginationProps) {
	if (!meta || meta.totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-between gap-3 border-t px-3 py-3 text-sm">
			<span className="text-muted-foreground">
				Page {meta.page} of {meta.totalPages} ({meta.total} total)
			</span>
			<div className="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={meta.page <= 1}
					onClick={() => onPageChange(meta.page - 1)}
				>
					<ChevronLeft /> Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={meta.page >= meta.totalPages}
					onClick={() => onPageChange(meta.page + 1)}
				>
					Next <ChevronRight />
				</Button>
			</div>
		</div>
	);
}
