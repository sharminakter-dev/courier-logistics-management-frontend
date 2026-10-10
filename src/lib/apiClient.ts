import { ofetch } from "ofetch";
import type { ApiSuccess } from "@/types/api.type";
import {
	ApiError,
	cleanQuery,
	type RequestOptions,
	toApiError,
} from "./api/request";

const BASE_URL = "/api/v1";

let refreshing: Promise<void> | null = null;

function send<T>(path: string, options: RequestOptions) {
	return ofetch<ApiSuccess<T>>(path, {
		baseURL: BASE_URL,
		method: options.method ?? "GET",
		body: options.body as Record<string, unknown> | undefined,
		query: cleanQuery(options.query),
		signal: options.signal,
		credentials: "include",
		headers: { Accept: "application/json" },
	});
}

function refreshSession(): Promise<void> {
	// Share one refresh between parallel requests that fail together.
	if (!refreshing) {
		refreshing = ofetch(`${BASE_URL}/auth/refresh-token`, {
			method: "POST",
			credentials: "include",
		})
			.then(() => undefined)
			.finally(() => {
				refreshing = null;
			});
	}
	return refreshing;
}

/** Browser API client: on 401 it refreshes the session once and retries. */
export async function apiClient<T>(
	path: string,
	options: RequestOptions = {},
): Promise<ApiSuccess<T>> {
	try {
		return await send<T>(path, options);
	} catch (error) {
		const apiError = toApiError(error);
		const canRefresh = apiError.status === 401 && !path.startsWith("/auth/");
		if (!canRefresh) throw apiError;

		try {
			await refreshSession();
		} catch {
			if (typeof window !== "undefined") window.location.assign("/login");
			throw new ApiError("Your session has expired. Please log in.", 401);
		}
		try {
			return await send<T>(path, options);
		} catch (retryError) {
			throw toApiError(retryError);
		}
	}
}
