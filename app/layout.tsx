import type { Metadata } from "next";
import "./globals.css";
import "./extra.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import SocialBar from "@/components/SocialBar";

export const metadata: Metadata = {
  title: "RoyalDice.eu | Provably Fair Color Dice",
  description:
    "RoyalDice.eu is a premium provably-fair color dice platform. Roll, view live statistics, and verify every result with a unique Result ID.",
  icons: { icon: "/icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Luckiest+Guy&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('royal-dice-theme')||'black-purple';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','black-purple');}})();`,
          }}
        />
      </head>
      <body>
        <Header />
        <ChatWidget />
        <div className="site-main">{children}</div>
        <Footer />
        <SocialBar />
      </body>
    </html>
  );
}
