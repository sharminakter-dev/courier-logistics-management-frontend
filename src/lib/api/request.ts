import { FetchError } from "ofetch";
import { ApiError, type ApiErrorBody } from "@/types/api";

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

export interface RequestOptions {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	body?: object;
	query?: QueryParams;
	signal?: AbortSignal;
}

// drop empty values so URLs stay clean (?page=1 instead of ?page=1&status=)
export const cleanQuery = (query?: QueryParams) => {
	const cleaned: Record<string, string | number | boolean> = {};

	for (const [key, value] of Object.entries(query ?? {})) {
		if (value !== undefined && value !== null && value !== "") {
			cleaned[key] = value;
		}
	}

	return cleaned;
};

export const toApiError = (error: unknown): ApiError => {
	if (error instanceof ApiError) return error;

	if (error instanceof FetchError) {
		const body = error.data as Partial<ApiErrorBody> | undefined;

		return new ApiError(
			error.statusCode ?? 500,
			body?.message ?? "Something went wrong. Please try again.",
			body?.errors ?? [],
		);
	}

	return new ApiError(500, "Network error. Please check your connection.");
};