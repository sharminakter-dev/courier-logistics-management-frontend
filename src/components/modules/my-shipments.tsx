"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { shipmentsApi } from "@/api/shipments.api";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toaster";
import { toApiError } from "@/lib/api/request";
import { ShipmentsTable } from "./shipments-table";

/** Shows the result of a bKash payment (the backend redirects here with ?status=). */
function PaymentResultToast() {
	const params = useSearchParams();
	const router = useRouter();
	const toast = useToast();
	const handled = useRef(false);

	useEffect(() => {
		if (handled.current) return;
		const status = params.get("status");
		const error = params.get("error");
		if (!status && !error) return;
		handled.current = true;

		if (status === "success") toast.success("Payment received. Pickup requested.");
		else if (status === "failure") toast.error("Payment failed. You can retry from the shipment page.");
		else if (status === "cancel") toast.info("Payment cancelled. You can retry from the shipment page.");
		else if (error) toast.error("Something went wrong with the payment.");

		router.replace("/dashboard/my-shipments");
	}, [params, router, toast]);

	return null;
}

export function MyShipments() {
	const [page, setPage] = useState(1);

	const query = useQuery({
		queryKey: ["shipments", "mine", page],
		queryFn: () => shipmentsApi.mine({ page, limit: 10 }),
		placeholderData: keepPreviousData,
	});

	return (
		<>
			<PaymentResultToast />
			<Card>
				{query.isPending ? (
					<ListSkeleton />
				) : query.isError ? (
					<ErrorState message={toApiError(query.error).message} />
				) : query.data.data.length === 0 ? (
					<EmptyState title="No shipments yet" description="Create your first shipment to get started." />
				) : (
					<>
						<ShipmentsTable items={query.data.data} basePath="/dashboard/my-shipments" />
						<Pagination meta={query.data.meta} onPageChange={setPage} />
					</>
				)}
			</Card>
		</>
	);
}
