import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title:
    "Aashi Sharma | Aspiring Clinical Psychologist & Mental Health Researcher",
  description:
    "Portfolio of Aashi Sharma, B.A. Applied Psychology (Hons with Research) at Amity University, focused on attachment, emotional regulation, and adult codependency.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Aashi Sharma",
    title: "Aashi Sharma | Aspiring Clinical Psychologist & Mental Health Researcher",
    description:
      "Portfolio of Aashi Sharma, B.A. Applied Psychology (Hons with Research) at Amity University.",
    images: [{ url: "/aashi.jpeg", alt: "Portrait of Aashi Sharma" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Keep the exact externally hosted font families used by index.html. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-brand-50 text-brand-900 font-sans min-h-screen relative overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
