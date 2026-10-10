import Link from "next/link";

export function PublicFooter() {
	return (
		<footer className="border-t bg-card">
			<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground">
				<p>Courier & Logistics Management</p>
				<Link href="/courier-signup" className="hover:text-foreground hover:underline">
					Become a courier
				</Link>
			</div>
		</footer>
	);
}
