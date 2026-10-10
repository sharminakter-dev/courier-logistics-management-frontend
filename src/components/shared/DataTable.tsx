import type { ReactNode } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export interface Column<T> {
	key: string;
	header: string;
	cell: (row: T) => ReactNode;
	className?: string;
}

interface DataTableProps<T> {
	columns: Column<T>[];
	rows: T[];
	getRowKey: (row: T) => string;
	empty: ReactNode;
}

export function DataTable<T>({ columns, rows, getRowKey, empty }: DataTableProps<T>) {
	if (rows.length === 0) return <>{empty}</>;

	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						{columns.map((column) => (
							<TableHead key={column.key} className={column.className}>
								{column.header}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map((row) => (
						<TableRow key={getRowKey(row)}>
							{columns.map((column) => (
								<TableCell key={column.key} className={column.className}>
									{column.cell(row)}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

// for loading.tsx files
export function TableSkeleton({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
	return (
		<div className="space-y-3 rounded-lg border p-4">
			{Array.from({ length: rows }, (_, row) => (
				<div key={`row-${row}`} className="flex gap-4">
					{Array.from({ length: columns }, (_, col) => (
						<Skeleton key={`cell-${row}-${col}`} className="h-6 flex-1" />
					))}
				</div>
			))}
		</div>
	);
}