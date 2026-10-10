import { FetchError } from "ofetch";
import type { ApiErrorBody, ApiFieldError } from "@/types/api.type";

export type QueryValue = string | number | boolean | null | undefined;

export type RequestOptions = {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	body?: unknown;
	query?: Record<string, QueryValue>;
	signal?: AbortSignal;
};

export class ApiError extends Error {
	status: number;
	errors: ApiFieldError[];

	constructor(message: string, status: number, errors: ApiFieldError[] = []) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.errors = errors;
	}
}

/** Drops empty values so they never reach the query string. */
export function cleanQuery(
	query?: Record<string, QueryValue>,
): Record<string, string | number | boolean> | undefined {
	if (!query) return undefined;
	const entries = Object.entries(query).filter(
		(entry): entry is [string, string | number | boolean] =>
			entry[1] !== undefined && entry[1] !== null && entry[1] !== "",
	);
	return entries.length ? Object.fromEntries(entries) : undefined;
}

export function toApiError(error: unknown): ApiError {
	if (error instanceof ApiError) return error;
	if (error instanceof FetchError) {
		const body = error.data as Partial<ApiErrorBody> | undefined;
		return new ApiError(
			body?.message ?? error.message,
			error.statusCode ?? 500,
			body?.errors ?? [],
		);
	}
	return new ApiError(
		error instanceof Error ? error.message : "Something went wrong",
		500,
	);
}
