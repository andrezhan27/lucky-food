import { notFound } from "next/navigation";
import { isLocale } from "@/lib/data";
import { metadataFor } from "@/lib/metadata";
import { Home } from "@/components/site";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return metadataFor(locale);
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Home locale={locale} />;
}
