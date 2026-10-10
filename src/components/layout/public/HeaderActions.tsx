import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOptionalUser } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/constants";
import { MobileNav } from "./MobileNav";

export async function HeaderActions() {
	const user = await getOptionalUser();
	const dashboardHref = user ? ROLE_HOME[user.role] : null;

	return (
		<>
			<div className="hidden items-center gap-2 lg:flex">
				{dashboardHref ? (
					<Button render={<Link href={dashboardHref} />} nativeButton={false}>
						Dashboard
					</Button>
				) : (
					<>
						<Button variant="ghost" render={<Link href="/login" />} nativeButton={false}>
							Login
						</Button>
						<Button render={<Link href="/register" />} nativeButton={false}>
							Register
						</Button>
					</>
				)}
			</div>

			<MobileNav dashboardHref={dashboardHref} />
		</>
	);
}