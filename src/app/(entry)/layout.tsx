import type { Viewport } from "next";
import type { Metadata } from "next";
import { heading, body } from "@/lib/fonts";
import "../globals.css";
export const metadata: Metadata = {
  title: "Lucky Food",
  description: "Sushi · Wok · Teppanyaki",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${heading.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#24231f",
};
