import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ChatWidget } from "@/components/assistant/ChatWidget";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSettings, hasPublishedArtists } from "@/lib/data";
import { db } from "@/lib/db";
import { LIVE_SETTING_KEYS, realtimeConfig, sealAnnouncement } from "@/lib/realtime";
import { LiveAnnouncement } from "@/components/layout/LiveAnnouncement";
import { DEFAULT_ANNOUNCEMENT } from "@/lib/site";
import { localBusinessJsonLd, organizationJsonLd } from "@/lib/seo";

export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const rt = realtimeConfig();
  const [settings, showArtists, live] = await Promise.all([
    getSettings(),
    hasPublishedArtists(),
    // With Neon Realtime configured: read the initial rows and seal the same live query in parallel.
    rt
      ? Promise.all([
          db.siteSetting.findMany({ where: { key: { in: [...LIVE_SETTING_KEYS] } }, select: { key: true, value: true } }),
          sealAnnouncement(),
        ]).catch(() => null)
      : null,
  ]);
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus:bg-fg focus:px-4 focus:py-3 focus:font-bold focus:text-bg"
      >
        Skip to content
      </a>
      {rt && live?.[1] ? (
        <LiveAnnouncement realtimeUrl={rt.url} sealedQuery={live[1]} initialData={live[0]} fallbackText={DEFAULT_ANNOUNCEMENT} />
      ) : (
        settings.announcementEnabled && settings.announcement && <AnnouncementBar text={settings.announcement} />
      )}
      <Header showArtists={showArtists} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <ScrollProgress />
      <ScrollToTop />
      <ChatWidget />
      <MobileTabBar />
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={localBusinessJsonLd()} />
    </>
  );
}
