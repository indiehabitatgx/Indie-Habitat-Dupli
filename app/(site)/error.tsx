"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-start justify-center gap-6 py-24">
      <p className="eyebrow">#technicaldifficulties</p>
      <h1 className="display-lg max-w-3xl">The mic cut out.</h1>
      <p className="max-w-xl text-lg text-muted">
        Something went wrong loading this page. Try again — if it keeps happening, call us on +91 98333 58492.
      </p>
      <Button onClick={reset}>Try again</Button>
    </section>
  );
}
