"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type ModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	children: ReactNode;
};

/** Modal built on the Base UI Dialog primitive. */
export function Modal({
	open,
	onOpenChange,
	title,
	description,
	children,
}: ModalProps) {
	return (
		<DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
				<DialogPrimitive.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border bg-background p-6 shadow-xl outline-none transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0">
					<DialogPrimitive.Title className="pr-8 text-lg font-semibold">
						{title}
					</DialogPrimitive.Title>
					{description && (
						<DialogPrimitive.Description className="mt-1 text-sm text-muted-foreground">
							{description}
						</DialogPrimitive.Description>
					)}
					<div className="mt-4">{children}</div>
					<DialogPrimitive.Close
						aria-label="Close"
						className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-accent"
					>
						<X className="size-4" />
					</DialogPrimitive.Close>
				</DialogPrimitive.Popup>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
