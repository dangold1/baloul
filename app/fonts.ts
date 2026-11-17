import { Heebo } from "next/font/google";

// One family for headings and text: Heebo, a clear Hebrew sans that stays readable at large sizes.
export const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-heebo",
});
