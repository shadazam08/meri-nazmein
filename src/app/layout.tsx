import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meri-nazmein.vercel.app/";


const siteName = "Meri Nazmein";

const siteDescription = "Meri Nazmein par nazmein, ghazals aur shayari padhiye aur naye authors ke alfaaz discover kijiye. Alfaaz se aage, ehsaason tak.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Meri Nazmein | Alfaaz Se Aage, Ehsaason Tak",
    template: "%s | Meri Nazmein",
  },

  description: siteDescription,

  keywords: [
    "Meri Nazmein",
    "nazmein",
    "nazm",
    "ghazal",
    "ghazals",
    "shayari",
    "Hindi poetry",
    "Urdu poetry",
    "Hindi shayari",
    "Urdu shayari",
    "poetry",
    "poets",
    "authors",
  ],

  applicationName: siteName,

  authors: [
    {
      name: siteName,
    },
  ],

  creator: siteName,

  publisher: siteName,

  alternates: {
    canonical: siteUrl,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: "Meri Nazmein | Alfaaz Se Aage, Ehsaason Tak",
    description: siteDescription,
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "Meri Nazmein | Alfaaz Se Aage, Ehsaason Tak",
    description: siteDescription,
  },

  category: "literature",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased`}
      >
        <SiteHeader />

        {children}

        <SiteFooter />
      </body>
    </html>
  );
}