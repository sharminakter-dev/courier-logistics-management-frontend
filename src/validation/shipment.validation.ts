import { z } from "zod";

const party = z.object({
	name: z.string().min(2, "At least 2 characters").max(100),
	phone: z.string().regex(/^\+?\d{7,15}$/, "Enter a valid phone number"),
	address: z.string().min(5, "At least 5 characters").max(255),
	city: z.string().min(2, "At least 2 characters").max(100),
});

export const shipmentSchema = z.object({
	pickup: party,
	receiver: party,
	weightKg: z
		.number("Enter the weight")
		.positive("Weight must be greater than 0")
		.max(50, "Maximum weight is 50 kg"),
	deliveryType: z.enum(["STANDARD", "EXPRESS"]),
	parcelDescription: z.string().max(500, "Maximum 500 characters"),
	pickupScheduledAt: z.string(),
});

export type ShipmentFormValues = z.infer<typeof shipmentSchema>;

export const hubSchema = z.object({
	name: z.string().min(2).max(100),
	code: z
		.string()
		.min(2, "2 to 10 characters")
		.max(10, "2 to 10 characters")
		.regex(/^[A-Za-z0-9-]+$/, "Letters, numbers and - only"),
	city: z.string().min(2).max(100),
	address: z.string().min(5).max(255),
	phone: z.union([z.string().regex(/^\d{7,15}$/, "7 to 15 digits"), z.literal("")]),
});

export const zoneSchema = z.object({
	name: z.string().min(2).max(100),
	areas: z.string().min(1, "Add at least one area"),
});

export const pricingSchema = z.object({
	sameCityBase: z.number("Required").positive("Must be greater than 0"),
	interCityBase: z.number("Required").positive("Must be greater than 0"),
	freeWeightKg: z.number("Required").positive("Must be greater than 0"),
	perExtraKg: z.number("Required").positive("Must be greater than 0"),
	expressMultiplier: z.number("Required").min(1, "Min 1").max(5, "Max 5"),
});

export type HubFormValues = z.infer<typeof hubSchema>;
export type PricingFormValues = z.infer<typeof pricingSchema>;
