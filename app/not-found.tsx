import Link from "next/link";
import { OutlineText } from "@/components/ui/OutlineText";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-svh items-center overflow-hidden">
      <div className="spotlight" aria-hidden />
      <div className="container-x relative py-24">
        <p className="eyebrow mb-6">#404</p>
        <h1 className="display-xl">
          Tough
          <br />
          <OutlineText>crowd.</OutlineText>
        </h1>
        <p className="mt-8 max-w-lg text-lg text-muted">
          This page didn&apos;t make it to the stage. It may have moved when the site was rebuilt.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className={buttonVariants()}>
            Back home
          </Link>
          <Link href="/events" className={buttonVariants({ variant: "outline" })}>
            See events
          </Link>
        </div>
      </div>
    </main>
  );
}
