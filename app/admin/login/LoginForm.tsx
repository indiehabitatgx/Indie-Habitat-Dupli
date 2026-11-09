"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Loading";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-display text-[0.72rem] font-bold uppercase tracking-[0.14em]">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-display text-[0.72rem] font-bold uppercase tracking-[0.14em]">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required minLength={8} className="field" />
      </div>
      {state?.error && (
        <p role="alert" className="border-l-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? <Spinner label="Signing in" /> : "Sign in"}
      </Button>
    </form>
  );
}
