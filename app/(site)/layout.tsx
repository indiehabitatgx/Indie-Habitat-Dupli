import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ChatWidget } from "@/components/assistant/ChatWidget";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSettings, hasPublishedArtists } from "@/lib/data";
import { localBusinessJsonLd, organizationJsonLd } from "@/lib/seo";

export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, showArtists] = await Promise.all([getSettings(), hasPublishedArtists()]);
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus:bg-fg focus:px-4 focus:py-3 focus:font-bold focus:text-bg"
      >
        Skip to content
      </a>
      {settings.announcementEnabled && settings.announcement && <AnnouncementBar text={settings.announcement} />}
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
