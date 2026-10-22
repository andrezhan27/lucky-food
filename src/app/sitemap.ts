import type { MetadataRoute } from "next";
import { origin, locales, restaurants } from "@/lib/data";
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    ["", "/restaurants/choose-branch", ...restaurants.map((r) => `/restaurants/${r.id}`)].map((path) => ({
      url: `${origin}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${origin}/${l}${path}`]),
        ),
      },
    })),
  );
}
