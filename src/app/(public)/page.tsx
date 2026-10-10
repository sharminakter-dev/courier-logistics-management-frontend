import { MapPin, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { TrackForm } from "@/components/modules/track-form";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const FEATURES = [
	{
		icon: Zap,
		title: "Standard or express",
		text: "Pick the speed you need. Prices are shown up front, no surprises.",
	},
	{
		icon: MapPin,
		title: "Live tracking",
		text: "Follow every handover from pickup to your receiver's door.",
	},
	{
		icon: ShieldCheck,
		title: "Pay securely",
		text: "Pay with bKash. Cancel before pickup and get an automatic refund.",
	},
];

export default function HomePage() {
	return (
		<>
			<section className="border-b bg-accent/40">
				<div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center">
					<h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
						Send parcels across the country, track every step
					</h1>
					<p className="max-w-xl text-muted-foreground">
						Book a pickup in minutes, pay online and follow your shipment until it is delivered.
					</p>
					<TrackForm />
					<div className="flex flex-wrap justify-center gap-3">
						<Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
							Send a parcel
						</Link>
						<Link href="/pricing" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
							See pricing
						</Link>
					</div>
				</div>
			</section>

			<section className="mx-auto grid max-w-5xl gap-6 px-4 py-16 sm:grid-cols-3">
				{FEATURES.map((feature) => (
					<div key={feature.title} className="rounded-xl border bg-card p-6">
						<feature.icon className="mb-3 size-6 text-primary" />
						<h2 className="font-semibold">{feature.title}</h2>
						<p className="mt-1 text-sm text-muted-foreground">{feature.text}</p>
					</div>
				))}
			</section>
		</>
	);
}
