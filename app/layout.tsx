import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kosofe Inside Out",
  description: "News that shape our community",
  icons: {
    icon: "/favicon.ico", // Points to your favicon in the public folder
  },
  openGraph: {
    title: "Kosofe Inside Out",
    description: "Trusted hyperlocal news, community updates, and verified intelligence from Kosofe.",
    url: "https://kosofeinsideout.com",
    siteName: "Kosofe Inside Out",
    images: [
      {
        url: "https://kosofeinsideout.com/img/kio-og-image.jpg", // Make sure this image exists in public/img/
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
      <body className={`${inter.className} bg-[#f5f5f5]`}>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}