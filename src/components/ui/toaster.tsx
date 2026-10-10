"use client";

import { CheckCircle2, Info, XCircle } from "lucide-react";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; type: ToastType; message: string };

type ToastApi = {
	success: (message: string) => void;
	error: (message: string) => void;
	info: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const push = useCallback((type: ToastType, message: string) => {
		const id = nextId++;
		setToasts((current) => [...current, { id, type, message }]);
		setTimeout(() => {
			setToasts((current) => current.filter((toast) => toast.id !== id));
		}, 4500);
	}, []);

	const api = useMemo<ToastApi>(
		() => ({
			success: (message) => push("success", message),
			error: (message) => push("error", message),
			info: (message) => push("info", message),
		}),
		[push],
	);

	return (
		<ToastContext.Provider value={api}>
			{children}
			<div
				aria-live="polite"
				className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
			>
				{toasts.map((toast) => (
					<div
						key={toast.id}
						role="status"
						className={cn(
							"pointer-events-auto flex items-start gap-2 rounded-lg border bg-card p-3 text-sm shadow-lg",
							toast.type === "error" && "border-destructive/40",
						)}
					>
						{toast.type === "success" && (
							<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
						)}
						{toast.type === "error" && (
							<XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
						)}
						{toast.type === "info" && (
							<Info className="mt-0.5 size-4 shrink-0 text-primary" />
						)}
						<span>{toast.message}</span>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast(): ToastApi {
	const context = useContext(ToastContext);
	if (!context) throw new Error("useToast must be used inside ToastProvider");
	return context;
}
