import type { Metadata, Viewport } from "next";
import { Montserrat, Raleway } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PageLoader } from "@/components/layout/PageLoader";
import { site } from "@/lib/site";
import "./globals.css";

// Variable fonts: one file per family covers every weight used.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});
const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}, Mumbai`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${montserrat.variable} ${raleway.variable}`}>
      <body>
        <PageLoader />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
