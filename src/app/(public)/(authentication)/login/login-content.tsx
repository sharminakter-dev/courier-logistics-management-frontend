
import { LoginForm } from "@/components/form/login-form";

export default async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string | string[] }>;
}) {
  const { redirect } = await searchParams;

  return (
    <LoginForm
      redirectTo={
        typeof redirect === "string" ? redirect : undefined
      }
    />
  );
}
