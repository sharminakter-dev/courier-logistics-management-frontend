import { format } from "date-fns";

export function formatCurrency(value: number | string | null | undefined) {
	const amount = Number(value ?? 0);
	return `৳${amount.toLocaleString("en-US", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	})}`;
}

export function formatDate(value: string | null | undefined) {
	if (!value) return "-";
	return format(new Date(value), "dd MMM yyyy");
}

export function formatDateTime(value: string | null | undefined) {
	if (!value) return "-";
	return format(new Date(value), "dd MMM yyyy, h:mm a");
}

/** PICKUP_REQUESTED -> Pickup requested */
export function labelize(value: string) {
	const text = value.replaceAll("_", " ").toLowerCase();
	return text.charAt(0).toUpperCase() + text.slice(1);
}
