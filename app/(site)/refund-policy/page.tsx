import { PolicyPage } from "@/components/layout/PolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Refund Policy",
  description: "Refund and ticket delivery policy for shows at The Habitat.",
  path: "/refund-policy",
});

export default function Page() {
  return <PolicyPage policyKey="refund-policy" />;
}
