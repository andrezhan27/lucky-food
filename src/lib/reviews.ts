import type { Locale, RestaurantId } from "./data";

export type CustomerReview = {
  id: string;
  restaurantId: RestaurantId;
  author: string;
  rating: 5;
  excerpt?: boolean;
  sourceImage: string;
  text: Record<Locale, string>;
};

// Transcribed from the eight screenshots supplied by the owner. French and
// Dutch are translations; relative screenshot dates are deliberately omitted.
export const customerReviews: CustomerReview[] = [
  {
    id: "marya-alswayed",
    restaurantId: "sint-pieters-leeuw",
    author: "Marya Alswayed",
    rating: 5,
    sourceImage: "codex-clipboard-11843d47-fff6-494e-bb5c-db4e9ec04347.png",
    text: {
      en: "The food was very delicious, The workers were very kindly and the sushi and the desserts and other japenese dishes we're the best japenese food i've ever had! Wpuld i go there again? Yes!",
      fr: "La nourriture était délicieuse, le personnel très gentil, et les sushis, les desserts et les autres plats japonais étaient les meilleurs que j’aie jamais mangés ! Est-ce que j’y retournerais ? Oui !",
      nl: "Het eten was heel lekker, het personeel was erg vriendelijk en de sushi, desserts en andere Japanse gerechten waren de beste die ik ooit heb gegeten! Zou ik er opnieuw naartoe gaan? Ja!",
    },
  },
  {
    id: "panos",
    restaurantId: "sint-pieters-leeuw",
    author: "Panos",
    rating: 5,
    sourceImage: "codex-clipboard-73d13ea9-34f4-4663-b1f8-189054ca9c85.png",
    text: {
      en: "A very value-for-money, well organised and clean place with brilliant and kind staff, for all-you-can-eat Asian food. Strongly suggested.",
      fr: "Un endroit propre et bien organisé, avec un excellent rapport qualité-prix et un personnel formidable et gentil, pour un buffet asiatique à volonté. Je recommande vivement.",
      nl: "Een propere, goed georganiseerde plek met een uitstekende prijs-kwaliteitverhouding en geweldig, vriendelijk personeel, voor Aziatisch eten à volonté. Een echte aanrader.",
    },
  },
  {
    id: "jamil-al-hassan",
    restaurantId: "sint-pieters-leeuw",
    author: "JAMIL AL HASSAN",
    rating: 5,
    sourceImage: "codex-clipboard-768c6d0d-e935-4ff4-a06e-5aef411d40e0.png",
    text: {
      en: "A lot of choices of food and variety 💥\nVery amazing service and staff,\nRecommended ...",
      fr: "Beaucoup de choix et de variété 💥\nUn service et un personnel vraiment formidables.\nJe recommande…",
      nl: "Veel keuze en variatie 💥\nFantastische service en geweldig personeel.\nEen aanrader…",
    },
  },
  {
    id: "ainol-venus",
    restaurantId: "sint-pieters-leeuw",
    author: "Ainol Venus",
    rating: 5,
    sourceImage: "codex-clipboard-d6140b1b-cdcd-4615-a4c9-6b5f80a95e59.png",
    text: {
      en: "Food factory! Open buffet eat all u can I loved it i will come back again",
      fr: "Une vraie fabrique à gourmandises ! Un buffet à volonté, j’ai adoré et je reviendrai.",
      nl: "Een echte eetfabriek! Een open buffet à volonté, ik vond het geweldig en kom zeker terug.",
    },
  },
  {
    id: "christian-erker",
    restaurantId: "jemeppe",
    author: "Christian Erker",
    rating: 5,
    sourceImage: "codex-clipboard-4de16272-5cdf-4269-96a0-0f05a7d5e3f9.png",
    text: {
      en: "Best Place for proper sized meal in the Area. Really friendly owner that recognize you even after not being there of an entire year.",
      fr: "Le meilleur endroit du coin pour un repas généreux. Le patron est vraiment sympathique et vous reconnaît même après une année sans être venu.",
      nl: "De beste plek in de buurt voor een stevige maaltijd. Een heel vriendelijke eigenaar die je zelfs na een jaar afwezigheid nog herkent.",
    },
  },
  {
    id: "celine-de-muynck",
    restaurantId: "jemeppe",
    author: "Céline De Muynck",
    rating: 5,
    excerpt: true,
    sourceImage: "codex-clipboard-e261257c-4047-4622-8775-20fe203c39c7.png",
    text: {
      en: "A fantastic experience at Lucky Food in Jemeppes!\n\nThe buffet is incredibly varied with a huge selection: Asian dishes, wok, teppanyaki, sushi, grilled meats… there's something for everyone. The food is delicious and the buffets are always well-stocked.",
      fr: "Une expérience fantastique chez Lucky Food à Jemeppes !\n\nLe buffet est incroyablement varié et le choix immense : plats asiatiques, wok, teppanyaki, sushis, viandes grillées… Il y en a pour tous les goûts. La nourriture est délicieuse et les buffets sont toujours bien garnis.",
      nl: "Een fantastische ervaring bij Lucky Food in Jemeppes!\n\nHet buffet is ongelooflijk gevarieerd, met een enorm aanbod: Aziatische gerechten, wok, teppanyaki, sushi, gegrild vlees… Er is voor ieder wat wils. Het eten is heerlijk en de buffetten worden altijd goed aangevuld.",
    },
  },
  {
    id: "clara-van-den-driessche",
    restaurantId: "jemeppe",
    author: "Clara Van den Driessche",
    rating: 5,
    sourceImage: "codex-clipboard-7f0cc4f4-26aa-4d7e-9a70-e73319e47a0a.png",
    text: {
      en: "Honestly, what a fantastic discovery! The dishes are incredibly fresh and bursting with flavor; you can really taste the quality of the ingredients from the very first bite—nothing like typical Chinese restaurants that are too greasy or processed.\n\nThe staff is warm and friendly.\nWe had a wonderful evening.",
      fr: "Franchement, quelle découverte fantastique ! Les plats sont incroyablement frais et pleins de saveurs ; on sent vraiment la qualité des ingrédients dès la première bouchée, loin des restaurants chinois habituels où les plats sont trop gras ou trop transformés.\n\nLe personnel est chaleureux et sympathique.\nNous avons passé une merveilleuse soirée.",
      nl: "Eerlijk, wat een fantastische ontdekking! De gerechten zijn ongelooflijk vers en vol smaak; je proeft de kwaliteit van de ingrediënten vanaf de eerste hap — heel anders dan bij doorsnee Chinese restaurants waar het eten te vet of te bewerkt is.\n\nHet personeel is hartelijk en vriendelijk.\nWe hebben een heerlijke avond gehad.",
    },
  },
  {
    id: "charles-collart",
    restaurantId: "jemeppe",
    author: "Charles Collart",
    rating: 5,
    sourceImage: "codex-clipboard-48970f38-82bd-451b-84bb-b536bad7d55b.png",
    text: {
      en: "Great restaurant, friendly staff.\nExcellent value for money.\nAfter a 2-hour visit, I left feeling full and satisfied. I'll definitely be back soon!",
      fr: "Excellent restaurant, personnel sympathique.\nExcellent rapport qualité-prix.\nAprès deux heures sur place, je suis reparti rassasié et satisfait. Je reviendrai très bientôt !",
      nl: "Geweldig restaurant, vriendelijk personeel.\nUitstekende prijs-kwaliteitverhouding.\nNa een bezoek van twee uur vertrok ik voldaan en tevreden. Ik kom zeker snel terug!",
    },
  },
];
