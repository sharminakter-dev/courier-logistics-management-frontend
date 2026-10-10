import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:5000";

const nextConfig: NextConfig = {
	cacheComponents: true,
	reactCompiler: true,
	// The browser talks to a single origin. Next proxies /api/v1/* to the
	// backend, so auth cookies are first-party and no CORS setup is needed.
	async rewrites() {
		return [
			{
				source: "/api/v1/:path*",
				destination: `${backendUrl}/api/v1/:path*`,
			},
		];
	},
};

export default nextConfig;
