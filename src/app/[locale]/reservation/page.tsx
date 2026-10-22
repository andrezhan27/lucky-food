import { notFound } from "next/navigation";
import { isLocale, restaurants } from "@/lib/data";
import { metadataFor } from "@/lib/metadata";
import { getDictionary } from "@/lib/translations";
import { RestaurantCard } from "@/components/site";
import { SectionSeparator } from "@/components/section-separator";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const metadata = metadataFor(locale, "/reservation");
  const title = `${t.reserve} · Lucky Food`;
  return {
    ...metadata, title, description: t.chooseBookingIntro,
    openGraph: { ...metadata.openGraph, title, description: t.chooseBookingIntro },
  };
}

export default async function ReservationChooser({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <section className="choose-branch section" aria-labelledby="booking-choice-title">
      <div className="container">
        <div className="section-heading">
          <div><p className="eyebrow">{t.reserve}</p><h1 id="booking-choice-title">{t.chooseBookingTitle}</h1></div>
          <p>{t.chooseBookingIntro}</p>
        </div>
        <div className="restaurant-grid">
          {restaurants.map((restaurant, index) => <RestaurantCard key={restaurant.id} restaurant={restaurant} locale={locale} index={index} reserving />)}
        </div>
      </div>
      <SectionSeparator />
    </section>
  );
}
