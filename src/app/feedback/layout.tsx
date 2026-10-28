import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Tu opinión",
  description: "Encuesta de demostración para conocer tu experiencia con fexpo en la feria.",
};

export default function FeedbackLayout({ children }: { children: ReactNode }) {
  return children;
}
