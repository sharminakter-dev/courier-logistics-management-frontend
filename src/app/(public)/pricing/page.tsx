import type { Metadata } from "next";
import { PriceCalculator } from "@/components/modules/price-calculator";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
	return (
		<div className="mx-auto max-w-5xl space-y-6 px-4 py-12">
			<div className="space-y-1">
				<h1 className="text-3xl font-semibold tracking-tight">Simple, transparent pricing</h1>
				<p className="text-muted-foreground">
					Price depends on the route, the weight and the service you choose.
				</p>
			</div>
			<PriceCalculator />
		</div>
	);
}
