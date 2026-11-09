import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/data";
import { getInstagramStatus, getInstagramToken } from "@/lib/instagram-server";
import { maskToken } from "@/lib/instagram";
import { PageTitle } from "@/app/admin/(panel)/PageTitle";
import { SettingsForm } from "@/app/admin/(panel)/settings/SettingsForm";
import { InstagramPanel } from "@/app/admin/(panel)/settings/InstagramPanel";

export const metadata = { title: "Settings" };

export default async function Settings() {
  const session = await requireAdmin("ADMIN");
  const [s, ig, { token }, username] = await Promise.all([
    getSettings(),
    getInstagramStatus(),
    getInstagramToken(),
    db.siteSetting.findUnique({ where: { key: "instagramUsername" } }),
  ]);
  return (
    <>
      <PageTitle title="Settings" description="Site-wide content and integrations managed outside the code." />
      <div className="grid gap-12">
        <SettingsForm values={s} />
        <InstagramPanel status={{ ...ig, username: username?.value ?? null, masked: maskToken(token) }} isAdmin={session.role === "ADMIN"} />
      </div>
    </>
  );
}
