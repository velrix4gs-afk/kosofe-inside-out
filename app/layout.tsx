import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Kosofe Inside Out",
  description: "News that shape our community",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Kosofe Inside Out",
    description: "Trusted hyperlocal news, community updates, and verified intelligence from Kosofe.",
    url: "https://kosofeinsideout.com",
    siteName: "Kosofe Inside Out",
    images: [
      {
        url: "https://kosofeinsideout.com/img/kio-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kosofe Inside Out - News that shape our community",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kosofe Inside Out",
    description: "Trusted hyperlocal news, community updates, and verified intelligence from Kosofe.",
    images: ["https://kosofeinsideout.com/img/kio-og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Using standard link tags for Inter, bypassing the build-time fetch error */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body className={`bg-[#f5f5f5] font-sans`}>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}