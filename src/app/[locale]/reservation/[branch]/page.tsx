import { notFound, redirect } from "next/navigation";
import { reservationPath, isLocale, locales, restaurants } from "@/lib/data";
import { metadataFor } from "@/lib/metadata";
import { getDictionary } from "@/lib/translations";

export function generateStaticParams() {
  return locales.flatMap(locale => restaurants.map(r => ({ locale, branch: r.id })));
}

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string; branch: string }>;
}) {
  const { locale, branch } = await params;
  const restaurant = restaurants.find(r => r.id === branch);
  if (!isLocale(locale) || !restaurant) notFound();
  const t = getDictionary(locale);
  const metadata = metadataFor(locale, reservationPath(restaurant, locale).replace(`/${locale}`, ""), restaurant.name);
  const title = `${t.reserve} · ${restaurant.name}`;
  return { ...metadata, title, openGraph: { ...metadata.openGraph, title } };
}

export default async function ReservationPage({ params }: {
  params: Promise<{ locale: string; branch: string }>;
}) {
  const { locale, branch } = await params;
  const restaurant = restaurants.find(r => r.id === branch);
  if (!isLocale(locale) || !restaurant) notFound();
  if (!restaurant.reservationWidgetUrl) {
    redirect(`/${locale}/restaurants/${restaurant.id}#reservation`);
  }
  const t = getDictionary(locale);
  return (
    <section className="reservation-page" aria-labelledby="booking-title">
      <h1 className="sr-only" id="booking-title">{t.reserve} · {restaurant.city}</h1>
      <iframe
        className="reservation-widget"
        loading="eager"
        src={restaurant.reservationWidgetUrl}
        title={restaurant.name}
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </section>
  );
}
