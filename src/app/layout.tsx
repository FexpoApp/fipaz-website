import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./dark-theme.css";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const poppins = localFont({
  src: [
    { path: "./fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Poppins-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fexpo Demo",
    template: "%s · Fexpo",
  },
  description:
    "Landing y simulación móvil para validar una nueva experiencia de ferias con mapas, NFC y recompensas.",
  applicationName: "Fexpo",
  icons: {
    icon: "/assets/brand/fexpo-app-icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#132D46",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{var t=localStorage.getItem('fexpo-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}" }} />
      </head>
      <body className="min-h-full flex flex-col">{children}<ThemeToggle /></body>
    </html>
  );
}
