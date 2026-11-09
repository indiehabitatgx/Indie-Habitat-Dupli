import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { cn, isSafeHttpUrl } from "@/lib/utils";

/**
 * Booking always hands off to the authorised ticketing provider (BookMyShow).
 * The site never sells tickets or shows availability itself.
 */
export function TicketCTA({
  url,
  provider,
  title,
  size = "md",
  className,
}: {
  url: string | null;
  provider: string | null;
  title: string;
  size?: "md" | "lg" | "sm";
  className?: string;
}) {
  if (!url || !isSafeHttpUrl(url)) {
    return (
      <a href="/contact" className={cn(buttonVariants({ variant: "outline", size }), className)}>
        Ask about tickets
      </a>
    );
  }
  const venueOnly = provider?.toLowerCase().includes("venue");
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ size }), className)}
    >
      <span>{venueOnly ? "Find on BookMyShow" : "Book tickets"}</span>
      <ArrowUpRight className="size-4" aria-hidden />
      <span className="sr-only">
        for {title} on {provider ?? "the ticketing site"} (opens in a new tab)
      </span>
    </a>
  );
}
