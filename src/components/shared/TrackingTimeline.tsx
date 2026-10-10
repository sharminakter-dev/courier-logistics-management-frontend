import type { TrackingEvent } from "@/types/shipment.type";
import { formatDateTime, labelize } from "@/utils/format";

type TrackingTimelineProps = {
	events: TrackingEvent[];
	/** Show the newest event first (the API returns detail events newest first). */
	newestFirst?: boolean;
};

export function TrackingTimeline({
	events,
	newestFirst = true,
}: TrackingTimelineProps) {
	const sorted = [...events].sort((a, b) => {
		const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		return newestFirst ? -diff : diff;
	});

	if (sorted.length === 0) {
		return <p className="text-sm text-muted-foreground">No updates yet.</p>;
	}

	return (
		<ol className="relative space-y-5 border-l pl-6">
			{sorted.map((event, index) => (
				<li key={`${event.status}-${event.createdAt}`} className="relative">
					<span
						className={`absolute -left-[31px] top-1 size-3 rounded-full border-2 border-background ${
							index === 0 ? "bg-primary" : "bg-muted-foreground/40"
						}`}
					/>
					<p className="text-sm font-medium">{labelize(event.status)}</p>
					{event.note && (
						<p className="text-sm text-muted-foreground">{event.note}</p>
					)}
					<p className="text-xs text-muted-foreground">
						{formatDateTime(event.createdAt)}
						{event.location ? ` · ${event.location}` : ""}
					</p>
				</li>
			))}
		</ol>
	);
}
