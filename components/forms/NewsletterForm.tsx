"use client";

import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Spinner } from "@/components/ui/Loading";
import { postJson } from "@/components/forms/submit";
import { cn } from "@/lib/utils";

// Lightweight on purpose: this form is in the footer of every page, so it avoids
// zod/react-hook-form in the shared bundle. The API route validates with the full zod schema.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterForm({ id = "newsletter", tone = "dark" }: { id?: string; tone?: "dark" | "paper" }) {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState(null);
    if (!EMAIL.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }
    setError(null);
    setPending(true);
    const res = await postJson("/api/newsletter", { email: email.trim(), company: trap });
    setPending(false);
    setState(res);
    if (res.ok) setEmail("");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative w-full">
      <div aria-hidden className="absolute -left-[10000px] top-auto size-px overflow-hidden">
        <label>
          Leave this empty
          <input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </label>
      </div>
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <div
        className={cn(
          "flex items-stretch border-b-2 transition-colors focus-within:border-amber",
          tone === "paper" ? "border-paper-ink/40" : "border-fg/40",
          error && "border-danger",
        )}
      >
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-msg`}
          className="min-h-14 w-full bg-transparent py-3 text-lg outline-none placeholder:opacity-50"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex shrink-0 items-center gap-2 px-2 font-display text-xs font-bold uppercase tracking-[0.16em] transition hover:text-amber disabled:opacity-60"
        >
          {pending ? <Spinner label="Subscribing" /> : <>Subscribe <ArrowRight className="size-4" aria-hidden /></>}
        </button>
      </div>
      <p id={`${id}-msg`} className={cn("mt-3 min-h-5 text-sm", error || (state && !state.ok) ? "text-danger" : "opacity-75")} aria-live="polite">
        {error ?? state?.message ?? ""}
      </p>
    </form>
  );
}
