import "server-only";
import { cookies } from "next/headers";
import { ofetch } from "ofetch";
import type { ApiSuccess } from "@/types/api";
import { cleanQuery, type RequestOptions, toApiError } from "./request";

export const apiServer = async <T>(
	path: string,
	options: RequestOptions = {},
): Promise<ApiSuccess<T>> => {
	const cookieStore = await cookies();

	try {
		return await ofetch<ApiSuccess<T>>(path, {
			baseURL: `${process.env.BACKEND_URL}/api/v1`,
			method: options.method ?? "GET",
			body: options.body as Record<string, unknown> | undefined,
			query: cleanQuery(options.query),
			signal: options.signal,
			cache: "no-store",
			headers: {
				Accept: "application/json",
				Cookie: cookieStore.toString(),
			},
		});
	} catch (error) {
		throw toApiError(error);
	}
};