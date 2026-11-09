import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  children,
  action,
  className,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 overflow-hidden border border-dashed border-line px-6 py-16 text-center",
        className,
      )}
    >
      <span className="ring-motif mb-2 grid size-16 place-items-center" aria-hidden>
        <span className="size-2 rounded-full bg-amber" />
      </span>
      <h3 className="font-display text-xl font-extrabold uppercase">{title}</h3>
      {children && <div className="max-w-md text-muted">{children}</div>}
      {action}
    </div>
  );
}
