import type { Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { heading, body } from "@/lib/fonts";
import "../globals.css";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/data";
import { getDictionary } from "@/lib/translations";
import { LanguageProvider, Navbar, PageFooter } from "@/components/interactive";
import { Footer } from "@/components/site";
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <html lang={locale} className={`${heading.variable} ${body.variable}`}>
      <body>
        <LanguageProvider locale={locale}>
          <div lang={locale}>
            <a className="skip-link" href="#main">
              {t.skip}
            </a>
            <Navbar />
            <main id="main">{children}</main>
            <PageFooter><Footer locale={locale} /></PageFooter>
          </div>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#24231f",
};
