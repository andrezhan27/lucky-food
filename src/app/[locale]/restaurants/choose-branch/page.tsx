import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/lib/data";

export default async function ChooseBranch({ params }: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(`/${locale}#pricing-overview`);
}
