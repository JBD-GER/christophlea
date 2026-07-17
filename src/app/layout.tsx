import type { Metadata, Viewport } from "next";
import { wedding } from "@/content/wedding";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: wedding.seo.title,
  description: wedding.seo.description,
  applicationName: wedding.couple.displayName,
  openGraph: {
    type: "website",
    locale: "de_DE",
    title: wedding.seo.openGraphTitle,
    description: wedding.seo.openGraphDescription,
    images: [{ url: wedding.seo.openGraphImage, width: 1200, height: 630, alt: wedding.hero.image.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.seo.openGraphTitle,
    description: wedding.seo.openGraphDescription,
    images: [wedding.seo.openGraphImage],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#201B1A",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
