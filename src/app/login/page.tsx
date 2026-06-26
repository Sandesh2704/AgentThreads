// app/login/page.tsx
import { FeedLayout } from "@/components/FeedLayout";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is already logged in, redirect to home
  if (user) {
    redirect("/");
  }

  return (
    <FeedLayout title="Sign In" maxWidth="sm" sidebar={null}>
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center ">
        <LoginForm />
      </div>
    </FeedLayout>
  );
}