import { HeroSection } from "@/components/home/HeroSection";
import { IntroSection } from "@/components/home/IntroSection";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { ExperiencesSection } from "@/components/home/ExperiencesSection";
import { ComedySection } from "@/components/home/ComedySection";
import { MusicPoetrySection } from "@/components/home/MusicPoetrySection";
import { VenueSection } from "@/components/home/VenueSection";
import { ArtistsSection } from "@/components/home/ArtistsSection";
import { GallerySection } from "@/components/home/GallerySection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { CorporateSection } from "@/components/home/CorporateSection";
import { SocialSection } from "@/components/home/SocialSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Marquee } from "@/components/ui/Marquee";
import { getArtists, getEvents, getFeaturedEvents } from "@/lib/data";
import { getInstagramFeed } from "@/lib/instagram-server";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = {
  ...pageMetadata({
    title: `${site.tagline} in Khar, Mumbai`,
    description:
      "Stand-up comedy, live music, poetry and open mics at The Habitat, Khar West, Mumbai — plus Above The Habitat, a jam room and spaces for private and corporate events.",
    path: "/",
  }),
  title: { absolute: `${site.name} — ${site.tagline}, Khar, Mumbai` },
};

export default async function HomePage() {
  const [featured, all, artists, insta] = await Promise.all([getFeaturedEvents(6), getEvents(), getArtists(), getInstagramFeed(8)]);
  const marquee = all.length ? all.map((e) => e.title) : ["Stand-up comedy", "Live music", "Poetry", "Open mics"];

  return (
    <>
      <HeroSection />
      <div className="border-y border-line bg-bg py-5 text-fg">
        <Marquee items={marquee} />
      </div>
      <IntroSection />
      <FeaturedEvents events={all.length ? all : featured} />
      <ExperiencesSection />
      <ComedySection />
      <MusicPoetrySection />
      <VenueSection />
      <ArtistsSection artists={artists.filter((a) => a.featured)} />
      <GallerySection />
      <CommunitySection />
      <CorporateSection />
      <SocialSection posts={insta.posts} />
      <NewsletterSection />
    </>
  );
}
