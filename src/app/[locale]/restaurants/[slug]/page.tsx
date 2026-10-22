import { notFound } from "next/navigation";
import { restaurants, locales, isLocale, origin } from "@/lib/data";
import { metadataFor } from "@/lib/metadata";
import { RestaurantDetail } from "@/components/site";
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    restaurants.map((r) => ({ locale, slug: r.id })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const r = restaurants.find((r) => r.id === slug);
  if (!isLocale(locale) || !r) notFound();
  return metadataFor(locale, `/restaurants/${slug}`, r.name);
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const r = restaurants.find((r) => r.id === slug);
  if (!isLocale(locale) || !r) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: r.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: r.address.split(",")[0],
      postalCode: r.id === "jemeppe" ? "5190" : "1600",
      addressLocality: r.city,
      addressCountry: "BE",
    },
    telephone: r.phone,
    email: r.email,
    url: `${origin}/${locale}/restaurants/${r.id}`,
    servesCuisine: ["Sushi", "Wok", "Teppanyaki"],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <RestaurantDetail restaurant={r} locale={locale} />
    </>
  );
}
