import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Official logo file, used unmodified (brand rule). */
export function Logo({ className, tone = "light", priority }: { className?: string; tone?: "light" | "dark"; priority?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex shrink-0 items-center", className)} aria-label="The Habitat — home">
      <Image
        src={tone === "light" ? "/images/brand/habitat-logo-w.png" : "/images/brand/habitat-logo-k.png"}
        alt="The Habitat"
        width={471}
        height={96}
        priority={priority}
        unoptimized
        className="h-7 w-auto md:h-8"
      />
    </Link>
  );
}
