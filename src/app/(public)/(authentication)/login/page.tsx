
import type { Metadata } from "next";
import { Suspense } from "react";
import LoginContent from "./login-content";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to create, track and manage your shipments.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string | string[] }>;
}) {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
