import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
			<span className="flex size-14 items-center justify-center rounded-full bg-muted">
				<SearchX className="size-6 text-muted-foreground" />
			</span>
			<h1 className="text-3xl font-bold">Page not found</h1>
			<p className="max-w-md text-muted-foreground">
				The page you are looking for doesn&apos;t exist or has been moved.
			</p>
			<div className="flex gap-2">
				<Button render={<Link href="/" />} nativeButton={false}>
					Go home
				</Button>
				<Button variant="outline" render={<Link href="/track" />} nativeButton={false}>
					Track a parcel
				</Button>
			</div>
		</div>
	);
}