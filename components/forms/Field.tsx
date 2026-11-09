import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Field({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="font-display text-[0.72rem] font-bold uppercase tracking-[0.14em]">
        {label}
        {required ? <span className="text-amber" aria-hidden> *</span> : <span className="font-sans text-[0.75rem] font-normal normal-case tracking-normal text-muted"> (optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-semibold text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** aria props for an input inside <Field>. */
export function fieldAria(id: string, error?: string, hint?: string) {
  return {
    id,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  };
}

/** Hidden honeypot field — bots fill it, humans never see it. */
export function Honeypot({ register }: { register: (name: "company") => object }) {
  return (
    <div aria-hidden className="absolute -left-[10000px] top-auto size-px overflow-hidden">
      <label>
        Leave this empty
        <input type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </label>
    </div>
  );
}

export function FormStatus({ state }: { state: { ok: boolean; message: string } | null }) {
  if (!state) return null;
  return (
    <div
      role={state.ok ? "status" : "alert"}
      className={cn(
        "border-l-2 px-4 py-3 text-sm font-semibold",
        state.ok ? "border-amber bg-amber/10 text-fg" : "border-danger bg-danger/10 text-danger",
      )}
    >
      {state.message}
    </div>
  );
}
