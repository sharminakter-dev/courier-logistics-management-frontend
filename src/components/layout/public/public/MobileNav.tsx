"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavLinks } from "./NavLinks";

export function MobileNav({ dashboardHref }: { dashboardHref: string | null }) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<div className="lg:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger
					render={<Button variant="outline" size="icon" aria-label="Open menu" />}
				>
					<Menu />
				</SheetTrigger>

				<SheetContent side="right" className="w-72">
					<SheetTitle className="sr-only">Menu</SheetTitle>

					<div className="mt-12 flex flex-col gap-4 px-4">
						<NavLinks vertical onNavigate={close} />
						<Separator />

						{dashboardHref ? (
							<Button render={<Link href={dashboardHref} onClick={close} />} nativeButton={false}>
								Dashboard
							</Button>
						) : (
							<div className="grid gap-2">
								<Button
									variant="outline"
									render={<Link href="/login" onClick={close} />}
									nativeButton={false}
								>
									Login
								</Button>
								<Button
									render={<Link href="/register" onClick={close} />}
									nativeButton={false}
								>
									Register
								</Button>
							</div>
						)}
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}