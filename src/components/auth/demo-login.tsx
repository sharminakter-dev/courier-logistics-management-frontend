import { Crown, LoaderCircle, ShieldCheck, Truck, User } from "lucide-react";
import type { ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { DEMO_ACCOUNTS, type DemoAccount } from "@/lib/constants";
import type { Role } from "@/types/enums";

const ICONS: Record<Role, ComponentType<{ className?: string }>> = {
	SUPER_ADMIN: Crown,
	ADMIN: ShieldCheck,
	CUSTOMER: User,
	COURIER: Truck,
};

interface DemoLoginProps {
	onSelect: (account: DemoAccount) => void;
	pendingRole: Role | null;
	disabled: boolean;
}

export function DemoLogin({ onSelect, pendingRole, disabled }: DemoLoginProps) {
	return (
		<section aria-label="Quick demo login" className="space-y-3">
			<p className="text-center text-sm font-medium">Quick Demo Login</p>

			<div className="grid grid-cols-2 gap-3">
				{DEMO_ACCOUNTS.map((account) => {
					const Icon = ICONS[account.role];
					const isPending = pendingRole === account.role;

					return (
						<div
							key={account.role}
							className="flex flex-col items-center gap-2 rounded-lg border p-3 text-center"
						>
							<span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Icon className="size-4" />
							</span>
							<div>
								<p className="text-sm font-semibold">{account.label}</p>
								<p className="text-xs text-muted-foreground">
									{account.description}
								</p>
							</div>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="mt-auto w-full"
								disabled={disabled}
								onClick={() => onSelect(account)}
							>
								{isPending && <LoaderCircle className="animate-spin" />}
								Demo Login
							</Button>
						</div>
					);
				})}
			</div>
		</section>
	);
}