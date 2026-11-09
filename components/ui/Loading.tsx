import { cn } from "@/lib/utils";

/** Ring spinner using the brand ring motif. */
export function Spinner({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-3", className)}>
      <span className="size-5 animate-spin rounded-full border-2 border-amber/25 border-t-amber" aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[2px] bg-white/6", className)} aria-hidden />;
}

export function PageLoading() {
  return (
    <div className="container-x flex min-h-[60vh] items-center justify-center pt-[var(--header-h)]">
      <Spinner label="Loading page" />
    </div>
  );
}
