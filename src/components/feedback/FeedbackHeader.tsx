import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FexpoBrand } from "@/components/shared/fexpo-brand";
import styles from "./feedback.module.css";

export function FeedbackHeader() {
  return (
    <header>
      <div className="border-b border-[#E2E0D8] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" aria-label="fexpo, ir al inicio" className="inline-flex shrink-0"><FexpoBrand /></Link>
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#626D78] transition-colors hover:text-[#132D46]">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            <span className="hidden sm:inline">Volver al inicio</span>
            <span className="sm:hidden">Inicio</span>
          </Link>
        </div>
      </div>
      <div className={styles.hero}>
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#D5F24A]">Tu opinión cuenta · Demostración</p>
          <h1 className="mt-4 max-w-3xl text-balance text-[clamp(2.3rem,5vw,4.2rem)] font-bold leading-[1.08] tracking-tight text-white">Ayúdanos a mejorar la experiencia en la feria.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">Cuéntanos qué te resultó útil y qué cambiarías de fexpo. Completar esta encuesta toma unos minutos.</p>
        </div>
      </div>
    </header>
  );
}
