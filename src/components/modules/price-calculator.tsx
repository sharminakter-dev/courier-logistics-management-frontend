"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { pricingApi } from "@/api/misc.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { DeliveryType } from "@/types/shipment.type";
import { formatCurrency } from "@/utils/format";

export function PriceCalculator() {
	const [pickupCity, setPickupCity] = useState("Cox's Bazar");
	const [receiverCity, setReceiverCity] = useState("Chittagong");
	const [weight, setWeight] = useState("1");
	const [deliveryType, setDeliveryType] = useState<DeliveryType>("STANDARD");

	const weightKg = Number(weight);
	const ready = pickupCity.trim().length >= 2 && receiverCity.trim().length >= 2 && weightKg > 0 && weightKg <= 50;

	const pricing = useQuery({
		queryKey: ["pricing"],
		queryFn: async () => (await pricingApi.get()).data,
	});

	const quote = useQuery({
		queryKey: ["quote", pickupCity, receiverCity, weightKg, deliveryType],
		queryFn: async () =>
			(await pricingApi.quote({ pickupCity, receiverCity, weightKg, deliveryType })).data,
		enabled: ready,
	});

	return (
		<div className="grid gap-6 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle>Price calculator</CardTitle>
					<CardDescription>Get an instant quote before you ship.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-1.5">
							<Label htmlFor="from">Pickup city</Label>
							<Input id="from" value={pickupCity} onChange={(e) => setPickupCity(e.target.value)} />
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="to">Delivery city</Label>
							<Input id="to" value={receiverCity} onChange={(e) => setReceiverCity(e.target.value)} />
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="weight">Weight (kg, max 50)</Label>
							<Input
								id="weight"
								type="number"
								min="0.1"
								max="50"
								step="0.1"
								value={weight}
								onChange={(e) => setWeight(e.target.value)}
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="type">Service</Label>
							<Select
								id="type"
								value={deliveryType}
								onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}
							>
								<option value="STANDARD">Standard</option>
								<option value="EXPRESS">Express</option>
							</Select>
						</div>
					</div>

					<div className="rounded-lg bg-accent p-4">
						<p className="text-sm text-muted-foreground">Estimated price</p>
						<p className="text-3xl font-semibold">
							{quote.data ? formatCurrency(quote.data.total) : "-"}
						</p>
						{quote.data && (
							<p className="mt-1 text-xs text-muted-foreground">
								Base {formatCurrency(quote.data.base)} + {quote.data.extraKg} extra kg (
								{formatCurrency(quote.data.extraCharge)})
								{quote.data.multiplier !== 1 && ` x ${quote.data.multiplier}`}
							</p>
						)}
						{!ready && <p className="mt-1 text-xs text-muted-foreground">Fill in the details above.</p>}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Current rates</CardTitle>
					<CardDescription>Applied to every new shipment.</CardDescription>
				</CardHeader>
				<CardContent>
					{pricing.data ? (
						<dl className="divide-y text-sm">
							{[
								["Same city base", formatCurrency(pricing.data.sameCityBase)],
								["Between cities base", formatCurrency(pricing.data.interCityBase)],
								["Free weight", `${pricing.data.freeWeightKg} kg`],
								["Each extra kg", formatCurrency(pricing.data.perExtraKg)],
								["Express multiplier", `x ${pricing.data.expressMultiplier}`],
							].map(([label, value]) => (
								<div key={label} className="flex justify-between py-2.5">
									<dt className="text-muted-foreground">{label}</dt>
									<dd className="font-medium">{value}</dd>
								</div>
							))}
						</dl>
					) : (
						<p className="text-sm text-muted-foreground">Loading rates...</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
