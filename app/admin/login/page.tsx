import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/app/admin/login/LoginForm";

export const metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden px-4">
      <div className="spotlight" aria-hidden />
      <div className="relative w-full max-w-sm border border-line bg-surface p-8">
        <Image src="/images/brand/habitat-logo-w.png" alt="The Habitat" width={471} height={96} unoptimized className="h-7 w-auto" />
        <h1 className="mb-8 mt-8 font-display text-2xl font-black uppercase">Admin sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
