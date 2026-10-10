import { format } from "date-fns";

export const formatCurrency = (value: number | string) =>
	new Intl.NumberFormat("en-BD", {
		style: "currency",
		currency: "BDT",
		maximumFractionDigits: 2,
	}).format(Number(value));

export const formatDate = (iso: string) => format(new Date(iso), "dd MMM yyyy");

export const formatDateTime = (iso: string) =>
	format(new Date(iso), "dd MMM yyyy, hh:mm a");

// "OUT_FOR_DELIVERY" -> "Out for delivery"
export const formatStatus = (value: string) => {
	const text = value.replace(/_/g, " ").toLowerCase();
	return text.charAt(0).toUpperCase() + text.slice(1);
};