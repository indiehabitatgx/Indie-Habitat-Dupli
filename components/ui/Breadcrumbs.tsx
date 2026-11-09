import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((it, i) => {
            const last = i === all.length - 1;
            return (
              <li key={it.path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="text-fg">{it.name}</span>
                ) : (
                  <Link href={it.path} className="underline-offset-4 hover:text-amber hover:underline">
                    {it.name}
                  </Link>
                )}
                {!last && <ChevronRight className="size-3.5 opacity-60" aria-hidden />}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}
