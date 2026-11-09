import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt = "",
  crumbs,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  imageAlt?: string;
  crumbs: { name: string; path: string }[];
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative -mt-[var(--header-h)] overflow-hidden pt-[calc(var(--header-h)+3rem)]",
        image ? "flex min-h-[78svh] flex-col justify-end pb-14 md:min-h-[72svh]" : "pb-12 md:pb-16",
        className,
      )}
    >
      {image ? (
        <div className="absolute inset-0 -z-10">
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-bg" aria-hidden />
        </div>
      ) : (
        <div className="spotlight -z-10 opacity-70" aria-hidden />
      )}
      <div className="container-x relative">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10">
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h1 className="display-xl max-w-4xl">{title}</h1>
          {intro && <div className="mt-8 max-w-2xl text-lg text-fg/85 md:text-xl">{intro}</div>}
          {children}
        </div>
      </div>
    </section>
  );
}
