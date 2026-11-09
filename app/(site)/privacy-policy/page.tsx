import { PolicyPage } from "@/components/layout/PolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How The Habitat collects, uses and protects your personal data.",
  path: "/privacy-policy",
});

export default function Page() {
  return <PolicyPage policyKey="privacy-policy" />;
}
