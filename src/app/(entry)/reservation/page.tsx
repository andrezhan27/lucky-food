import { redirect } from "next/navigation";
import { jemeppe, reservationPath } from "@/lib/data";

export default function ReservationEntry() {
  redirect(reservationPath(jemeppe, "fr"));
}
