import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/content";
import Cursor from "@/components/ui/Cursor";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  keywords: ["Black Circle", "private business group", "talent", "automotive", "property", "fashion", "ventures"],
  icons: { icon: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Black Circle",
  url: site.url,
  description: site.description,
  slogan: "Private by nature. Global by vision.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
