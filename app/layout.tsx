import type { Metadata } from "next";
import { EB_Garamond, Lato } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { site } from "@/lib/site";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.company.shortName} | ${site.company.tagline}`,
    template: `%s | ${site.company.shortName}`,
  },
  description: site.company.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ebGaramond.variable} ${lato.variable}`}>
      <body className="antialiased">
        <ScrollProgressBar />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
