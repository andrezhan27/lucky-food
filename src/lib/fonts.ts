import { Manrope, Outfit } from "next/font/google";

// Geometric headings echo the logo; Manrope keeps text and prices easy to scan.
export const heading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
export const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
