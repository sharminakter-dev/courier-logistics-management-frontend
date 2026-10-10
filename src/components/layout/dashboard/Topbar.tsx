"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Me } from "@/types/user";
import { Brand } from "../Brand";
import { SidebarContent } from "./SidebarContent";

export function Topbar({ user }: { user: Me }) {
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur lg:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger
					render={<Button variant="outline" size="icon" aria-label="Open menu" />}
				>
					<Menu />
				</SheetTrigger>
				<SheetContent side="left" className="w-72 p-0">
					<SheetTitle className="sr-only">Navigation</SheetTitle>
					<SidebarContent user={user} onNavigate={() => setOpen(false)} />
				</SheetContent>
			</Sheet>

			<Brand />
		</header>
	);
}