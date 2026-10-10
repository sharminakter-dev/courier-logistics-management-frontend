import { type NextRequest, NextResponse } from "next/server";

/**
 * Optimistic gate for the dashboard areas.
 *
 * - No session cookies at all: redirect to /login.
 * - Access token expired but refresh token present: refresh here, so Server
 *   Components render with fresh cookies (they cannot set cookies themselves).
 *
 * Real role checks stay in requireRole(); the backend enforces them again.
 */
export async function proxy(request: NextRequest) {
	const hasAccess = request.cookies.has("accessToken");
	const refreshToken = request.cookies.get("refreshToken")?.value;

	if (hasAccess) return NextResponse.next();

	if (!refreshToken) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.search = "";
		return NextResponse.redirect(url);
	}

	try {
		const backend = process.env.BACKEND_URL ?? "http://localhost:5000";
		const res = await fetch(`${backend}/api/v1/auth/refresh-token`, {
			method: "POST",
			headers: {
				Cookie: request.headers.get("cookie") ?? "",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken }),
			cache: "no-store",
		});

		if (!res.ok) throw new Error("refresh failed");

		const setCookies = res.headers.getSetCookie();
		const fresh = new Map<string, string>();
		for (const line of setCookies) {
			const [pair] = line.split(";");
			const index = pair.indexOf("=");
			if (index > 0) fresh.set(pair.slice(0, index).trim(), pair.slice(index + 1));
		}

		const merged = new Map<string, string>();
		for (const cookie of request.cookies.getAll()) {
			merged.set(cookie.name, cookie.value);
		}
		for (const [name, value] of fresh) merged.set(name, value);

		const headers = new Headers(request.headers);
		headers.set(
			"cookie",
			[...merged].map(([name, value]) => `${name}=${value}`).join("; "),
		);

		const response = NextResponse.next({ request: { headers } });
		for (const line of setCookies) response.headers.append("set-cookie", line);
		return response;
	} catch {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.search = "";
		const response = NextResponse.redirect(url);
		response.cookies.delete("accessToken");
		response.cookies.delete("refreshToken");
		return response;
	}
}

export const config = {
	matcher: ["/dashboard/:path*", "/admin/:path*", "/courier/:path*"],
};
