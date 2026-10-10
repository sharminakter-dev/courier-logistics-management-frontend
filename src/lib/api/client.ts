import { FetchError, ofetch } from "ofetch";
import type { ApiSuccess } from "@/types/api";
import { cleanQuery, type RequestOptions, toApiError } from "./request";

const request = ofetch.create({
	baseURL: "/api/v1",
	credentials: "include",
	headers: { Accept: "application/json" },
});

let refreshing: Promise<boolean> | null = null;

const refreshSession = () => {
	if (!refreshing) {
		refreshing = request("/auth/refresh-token", { method: "POST" })
			.then(() => true)
			.catch(() => false)
			.finally(() => {
				refreshing = null;
			});
	}

	return refreshing;
};

export const apiClient = async <T>(
	path: string,
	options: RequestOptions = {},
): Promise<ApiSuccess<T>> => {
	const run = () =>
		request<ApiSuccess<T>>(path, {
			method: options.method ?? "GET",
			body: options.body as Record<string, unknown> | undefined,
			query: cleanQuery(options.query),
			signal: options.signal,
		});

	try {
		return await run();
	} catch (error) {
		const isExpired =
			error instanceof FetchError &&
			error.statusCode === 401 &&
			!path.startsWith("/auth/");

		if (isExpired && (await refreshSession())) {
			try {
				return await run();
			} catch (retryError) {
				throw toApiError(retryError);
			}
		}

		throw toApiError(error);
	}
};