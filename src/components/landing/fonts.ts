import localFont from "next/font/local";
import { Space_Mono } from "next/font/google";

// Tipografía oficial única de Fexpo según la Guía de marca v1.0: Poppins (Google Fonts).
// Se cargan todos los pesos requeridos desde src/app/fonts/ para toda la landing.

export const headingFont = localFont({
  src: [
    { path: "../../app/fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../app/fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../app/fonts/Poppins-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-heading-poppins",
  display: "swap",
});

export const eyebrowFont = localFont({
  src: [
    { path: "../../app/fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../app/fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../app/fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-eyebrow-poppins",
  display: "swap",
});

// Variables compatibles para módulos CSS de la landing (parallax, solution, demos)
// Todas alimentadas por Poppins en sus respectivos pesos según la guía:
export const soraFont = localFont({
  src: [
    { path: "../../app/fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../app/fonts/Poppins-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-sora",
  display: "swap",
});

export const jakartaFont = localFont({
  src: [
    { path: "../../app/fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../app/fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../app/fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-jakarta",
  display: "swap",
});

export const spaceMonoFont = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});
