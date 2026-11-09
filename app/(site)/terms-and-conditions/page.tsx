import { PolicyPage } from "@/components/layout/PolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "Ticket, entry and seating terms for shows at The Habitat, Khar West, Mumbai.",
  path: "/terms-and-conditions",
});

export default function Page() {
  return <PolicyPage policyKey="terms-and-conditions" />;
}
