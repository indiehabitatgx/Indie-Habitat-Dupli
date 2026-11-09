"use client";

import { usePathname } from "next/navigation";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

/** The homepage has a dedicated newsletter section, so the footer form is skipped there. */
export function FooterNewsletter() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <>
      <p className="mb-2 text-muted">New shows, straight to your inbox.</p>
      <NewsletterForm id="footer-newsletter" />
    </>
  );
}
