export const locales = ["fr", "nl", "en"] as const;
export type Locale = (typeof locales)[number];
export const isLocale = (s: string): s is Locale =>
  locales.includes(s as Locale);
export type RestaurantId = "sint-pieters-leeuw" | "jemeppe";
export type PriceRow = {
  period: "weekLunch" | "satLunch" | "allLunch" | "weekDinner" | "weekend";
  base: number;
  plus: number;
  children?: [number, number];
};
export type GalleryPhoto = {
  src: string;
  altKey:
    | "altSeafood"
    | "altHotBuffet"
    | "altWokBuffet"
    | "altSushiBuffet"
    | "altSeafoodCounter"
    | "altDessertBuffet"
    | "altJemeppeDining"
    | "altJemeppeCounter"
    | "spaceAlt"
    | "photoAlt"
    | "restaurantExterior";
  city?: string;
};
export type FoodPhoto = GalleryPhoto & { width: number; height: number };
export type Restaurant = {
  id: RestaurantId;
  city: string;
  name: string;
  address: string;
  mapsUrl: string;
  mapEmbedUrl: string;
  phone: string;
  telephone: string;
  email: string;
  lunch: string;
  dinner: string;
  prices: PriceRow[];
  takeaway: { volumeCc: number; price: number }[];
  image: string | null;
  gallery: GalleryPhoto[];
  foodPhotos: FoodPhoto[];
  news: {
    title: string;
    date: string;
    summary: string;
    image?: string;
    url?: string;
  }[];
  reservationWidgetUrl?: string;
  websiteUrl?: string;
  pendingConfirmation: string[];
};
export const jemeppe = {
  id: "jemeppe",
  city: "Jemeppe-sur-Sambre",
  name: "Lucky Food Jemeppe",
  address: "27 Rue Baty des Puissances, 5190 Jemeppe-sur-Sambre",
  mapsUrl: "https://maps.app.goo.gl/V1b1UBnrVTtK64qE7",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.330624999076!2d4.640380476595241!3d50.45356767159281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c186786cb304a3%3A0x9016d2fc84ab28bd!2sLucky%20Food!5e0!3m2!1sen!2spt!4v1792688363544!5m2!1sen!2spt",
  phone: "071/776.888",
  telephone: "071776888",
  email: "luckyfoodwok@gmail.com",
  lunch: "12:00–14:00",
  dinner: "18:00–22:00",
  image: "/images/jemeppe-hero.webp",
  gallery: [
    {
      src: "/images/j-space-1.webp",
      altKey: "altJemeppeDining",
      city: "Jemeppe-sur-Sambre",
    },
    {
      src: "/images/j-space-2.webp",
      altKey: "altJemeppeCounter",
      city: "Jemeppe-sur-Sambre",
    },
    ...[3, 4, 5, 6].map((number): GalleryPhoto => ({
      src: `/images/j-space-${number}.webp`,
      altKey: "spaceAlt",
    })),
  ],
  foodPhotos: [
    {
      src: "/images/j-food-1.webp",
      width: 1786,
      height: 880,
      altKey: "altSeafoodCounter",
      city: "Jemeppe-sur-Sambre",
    },
    ...([
      "altSushiBuffet",
      "altHotBuffet",
      "altDessertBuffet",
      "altDessertBuffet",
      "altHotBuffet",
      "altDessertBuffet",
    ] as const).map((altKey, index) => ({
      src: `/images/j-food-${index + 2}.webp${index === 0 ? "?v=2" : ""}`,
      width: 1448,
      height: 1086,
      altKey,
      city: "Jemeppe-sur-Sambre",
    })),
  ],
  news: [],
  reservationWidgetUrl: "https://reserve.intelis.pt/lucky-food-jss",
  prices: [
    { period: "allLunch", base: 22, plus: 29, children: [11, 16] },
    { period: "weekDinner", base: 33, plus: 40, children: [16, 26] },
    { period: "weekend", base: 35, plus: 42, children: [16, 26] },
  ],
  takeaway: [
    { volumeCc: 750, price: 13 },
    { volumeCc: 450, price: 10 },
  ],
  pendingConfirmation: [
    "Contact hours 12:00–14:00 and 18:00–22:00 conflict with pricing 12:00–15:00 and 18:00–23:00. Contact hours used provisionally.",
    "Confirm under-4 and children’s Plus prices.",
    "Provide legal content.",
  ],
} satisfies Restaurant;

export const sintPietersLeeuw = {
  id: "sint-pieters-leeuw",
  city: "Sint-Pieters-Leeuw",
  name: "Lucky Food Sint-Pieters-Leeuw",
  address: "Chaussée de Mons 67B, 1600 Sint-Pieters-Leeuw",
  mapsUrl: "https://maps.app.goo.gl/yjSzP5L8B4a2nTC76",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2521.439264414583!2d4.28774477661568!3d50.80449967166196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c7e80df0a867%3A0x3960338a85525656!2sLucky%20Food!5e0!3m2!1sen!2spt!4v1792688408789!5m2!1sen!2spt",
  phone: "02/2188.888",
  telephone: "+3222188888",
  email: "luckyfoodbxl@gmail.com",
  lunch: "12:00–14:30",
  dinner: "18:00–22:00",
  image: "/images/spl-exterior.webp",
  gallery: [
    { src: "/images/spl-exterior.webp", altKey: "photoAlt" },
    ...[1, 2, 3].map((number): GalleryPhoto => ({
      src: `/images/spl-space-${number}.webp`,
      altKey: "spaceAlt",
    })),
  ],
  foodPhotos: [],
  news: [],
  websiteUrl: "https://www.buffetluckyfood.be/bxl-accueil.html",
  prices: [],
  takeaway: [],
  pendingConfirmation: [
    "Contact lunch closes 14:30; pricing screenshot says 14:00. Contact hours used provisionally.",
    "Provide legal content.",
  ],
} satisfies Restaurant;

export const restaurants: Restaurant[] = [jemeppe, sintPietersLeeuw];
const deploymentHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const origin = new URL(
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
    (deploymentHost ? `https://${deploymentHost}` : "http://localhost:3000"),
).origin;
export const directions = (r: Restaurant) => r.mapsUrl;
export const reservationPath = (r: Restaurant, locale: Locale) =>
  `/${locale}/reservation/${r.id}`;
export const booking = (r: Restaurant, locale: Locale) =>
  r.reservationWidgetUrl ? reservationPath(r, locale) : `tel:${r.telephone}`;
export const money = (value: number, locale: Locale) =>
  new Intl.NumberFormat(`${locale}-BE`, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
