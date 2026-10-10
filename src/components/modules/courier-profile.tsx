"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { couriersApi } from "@/api/couriers.api";
import { DetailRow } from "@/components/shared/DetailRow";
import { ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toaster";
import { toApiError } from "@/lib/api/request";
import { labelize } from "@/utils/format";

export function CourierProfileView() {
	const toast = useToast();
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ["courier", "me"],
		queryFn: async () => (await couriersApi.me()).data,
	});

	const availability = useMutation({
		mutationFn: (isAvailable: boolean) => couriersApi.setAvailability(isAvailable),
		onSuccess: async (res) => {
			toast.success(res.data.isAvailable ? "You are online" : "You are offline");
			await queryClient.invalidateQueries({ queryKey: ["courier", "me"] });
		},
		onError: (error) => toast.error(toApiError(error).message),
	});

	if (query.isPending) return <ListSkeleton rows={5} />;
	if (query.isError) return <ErrorState message={toApiError(query.error).message} />;

	const profile = query.data;

	return (
		<div className="space-y-6">
			{!profile.isApproved && (
				<div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
					Your account is waiting for admin approval. You can go online and receive shipments
					once you are approved.
				</div>
			)}

			<div className="grid gap-4 sm:grid-cols-2">
				<Card>
					<CardHeader className="pb-1">
						<p className="text-sm text-muted-foreground">Delivered</p>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-semibold">{profile.stats.delivered}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-1">
						<p className="text-sm text-muted-foreground">Active deliveries</p>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-semibold">{profile.stats.active}</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="flex-row items-center justify-between">
					<CardTitle>Availability</CardTitle>
					<Badge variant={profile.isAvailable ? "success" : "secondary"}>
						{profile.isAvailable ? "Online" : "Offline"}
					</Badge>
				</CardHeader>
				<CardContent className="flex flex-wrap items-center justify-between gap-3">
					<p className="text-sm text-muted-foreground">
						Only online couriers can be assigned new pickups.
					</p>
					<Button
						variant={profile.isAvailable ? "outline" : "default"}
						disabled={!profile.isApproved || availability.isPending}
						onClick={() => availability.mutate(!profile.isAvailable)}
					>
						{profile.isAvailable ? "Go offline" : "Go online"}
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Profile</CardTitle>
				</CardHeader>
				<CardContent>
					<dl className="divide-y">
						<DetailRow label="Name">{profile.user.name}</DetailRow>
						<DetailRow label="Email">{profile.user.email}</DetailRow>
						<DetailRow label="Phone">{profile.user.phone ?? "-"}</DetailRow>
						<DetailRow label="Vehicle">{labelize(profile.vehicleType)}</DetailRow>
						<DetailRow label="Hub">{profile.hub?.name ?? "Not assigned"}</DetailRow>
					</dl>
				</CardContent>
			</Card>
		</div>
	);
}
