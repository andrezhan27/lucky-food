import { notFound, redirect } from "next/navigation";
import { booking, restaurants } from "@/lib/data";

export function generateStaticParams() {
  return restaurants.map(r => ({ branch: r.id }));
}

export default async function ReservationEntry({ params }: { params: Promise<{ branch: string }> }) {
  const { branch } = await params;
  const restaurant = restaurants.find(r => r.id === branch);
  if (!restaurant) notFound();
  redirect(booking(restaurant, "fr"));
}
