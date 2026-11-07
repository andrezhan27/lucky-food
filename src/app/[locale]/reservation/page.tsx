import { notFound, redirect } from "next/navigation";
import { isLocale, jemeppe, reservationPath } from "@/lib/data";

export default async function ReservationEntry({ params }: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(reservationPath(jemeppe, locale));
}
