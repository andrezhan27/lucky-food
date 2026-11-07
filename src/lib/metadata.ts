import type { Metadata } from "next";
import { origin, locales, type Locale } from "./data";
import { getDictionary } from "./translations";
export function metadataFor(
  locale: Locale,
  path = "",
  name = "Lucky Food",
): Metadata {
  const t = getDictionary(locale);
  const title = path
    ? `${name} · ${t.prices} & ${t.contact}`
    : `Lucky Food · ${t.food}`;
  const description = t.meta;
  return {
    metadataBase: new URL(origin),
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: Object.fromEntries([
        ...locales.map((l) => [l, `${origin}/${l}${path}`]),
        ["x-default", `${origin}/fr${path}`],
      ]),
    },
    openGraph: {
      title,
      description,
      url: `${origin}/${locale}${path}`,
      siteName: "Lucky Food",
      locale: `${locale}_BE`,
      images: [
        {
          url: "/images/hero-1.webp",
          width: 1672,
          height: 941,
          alt: "Lucky Food",
        },
      ],
      type: "website",
    },
  };
}
