import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, restaurants } from "@/lib/data";
import { getDictionary } from "@/lib/translations";
import { metadataFor } from "@/lib/metadata";
import { RestaurantCard } from "@/components/site";
import { SectionSeparator } from "@/components/section-separator";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const metadata = metadataFor(locale, "/restaurants/choose-branch");
  const title = `${t.prices} · Lucky Food`;
  return {
    ...metadata,
    title,
    description: t.choosePricesIntro,
    openGraph: { ...metadata.openGraph, title, description: t.choosePricesIntro },
  };
}

export default async function ChooseBranch({ params }: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <section className="choose-branch section" aria-labelledby="choose-branch-title">
      <div className="container">
        <nav className="choose-branch-breadcrumb" aria-label={t.home}>
          <Link href={`/${locale}`}>{t.home}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{t.prices}</span>
        </nav>
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.prices}</p>
            <h1 id="choose-branch-title">{t.choosePricesTitle}</h1>
          </div>
          <p>{t.choosePricesIntro}</p>
        </div>
        <div className="restaurant-grid">
          {restaurants.map((restaurant, index) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} locale={locale} index={index} pricing />
          ))}
        </div>
      </div>
      <SectionSeparator />
    </section>
  );
}
