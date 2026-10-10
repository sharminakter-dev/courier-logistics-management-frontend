import type { Metadata } from "next";
import { TrackForm } from "@/components/modules/track-form";

export const metadata: Metadata = { title: "Track a shipment" };

export default function TrackPage() {
	return (
		<div className="mx-auto max-w-3xl space-y-4 px-4 py-16 text-center">
			<h1 className="text-3xl font-semibold tracking-tight">Track a shipment</h1>
			<p className="text-muted-foreground">
				Enter your tracking number to see where your parcel is.
			</p>
			<div className="flex justify-center pt-2">
				<TrackForm />
			</div>
		</div>
	);
}
