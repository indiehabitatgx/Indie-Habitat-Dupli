import policies from "@/content/policies.json";
import { PageHero } from "@/components/layout/PageHero";

type Block = { type: "p" | "h2" | "h3"; text: string } | { type: "ul"; items: string[] };
type Policy = { title: string; updated: string | null; blocks: Block[] };

export type PolicyKey = "privacy-policy" | "terms-and-conditions" | "refund-policy";

export function getPolicy(key: PolicyKey) {
  return (policies as Record<PolicyKey, Policy>)[key];
}

/** Legal text is reproduced verbatim from the previous website; changes must come from the client. */
export function PolicyPage({ policyKey }: { policyKey: PolicyKey }) {
  const p = getPolicy(policyKey);
  return (
    <>
      <PageHero
        eyebrow="#legal"
        title={p.title}
        intro={p.updated ? `Last updated: ${p.updated}` : undefined}
        crumbs={[{ name: p.title, path: `/${policyKey}` }]}
      />
      <section className="container-x pb-28">
        <div className="mx-auto max-w-3xl space-y-5 text-[1.05rem] leading-relaxed text-fg/85 [&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:text-fg [&_h3]:mt-10 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:uppercase [&_h3]:text-amber">
          {p.blocks.map((b, i) =>
            b.type === "ul" ? (
              <ul key={i} className="list-disc space-y-3 pl-6 marker:text-amber">
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            ) : b.type === "h2" ? (
              <h2 key={i}>{b.text}</h2>
            ) : b.type === "h3" ? (
              <h3 key={i}>{b.text}</h3>
            ) : (
              <p key={i}>{b.text}</p>
            ),
          )}
        </div>
      </section>
    </>
  );
}
