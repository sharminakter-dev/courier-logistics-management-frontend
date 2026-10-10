import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type UrlValue = string | number | null | undefined;

export const useUrlState = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const get = useCallback((key: string) => searchParams.get(key), [searchParams]);

	// any change resets to page 1, unless "page" itself is being set
	const set = useCallback(
		(updates: Record<string, UrlValue>) => {
			const params = new URLSearchParams(searchParams.toString());

			for (const [key, value] of Object.entries(updates)) {
				if (value === null || value === undefined || value === "") {
					params.delete(key);
				} else {
					params.set(key, String(value));
				}
			}

			if (!("page" in updates)) params.delete("page");

			const query = params.toString();
			router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
		},
		[router, pathname, searchParams],
	);

	return { get, set };
};