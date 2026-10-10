"use client";

import { Eye, EyeOff } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function PasswordInput({ className, ...props }: ComponentProps<typeof Input>) {
	const [visible, setVisible] = useState(false);

	return (
		<div className="relative">
			<Input
				{...props}
				type={visible ? "text" : "password"}
				className={cn("pr-10", className)}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
				onClick={() => setVisible((prev) => !prev)}
				aria-label={visible ? "Hide password" : "Show password"}
			>
				{visible ? <EyeOff /> : <Eye />}
			</Button>
		</div>
	);
}