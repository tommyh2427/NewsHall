import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NewsHall — Your Morning Brief",
  description: "Your topics. Real sources. One brief, every morning.",
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NewsHall" />
        <meta name="theme-color" content="#0b0b10" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* The app renders in Playfair Display + Inter. These were previously
            pulled in by an @import inside the injected <style> tag, which only
            starts downloading after React renders; as <link> here they begin
            during HTML parse. (Fraunces, Plus Jakarta and DM Mono used to be
            loaded here and were entirely unused.) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
