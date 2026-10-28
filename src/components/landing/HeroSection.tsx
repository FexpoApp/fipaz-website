"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown, Compass, Gift, Smartphone, Award } from "lucide-react";
import { headingFont } from "./fonts";
import heroImage from "../../../public/img/landing/inicial landing.webp";

const benefits = [
  {
    icon: <Compass className="h-4 w-4 text-[#1677b8]" />,
    text: "Explora el mapa",
  },
  {
    icon: <Smartphone className="h-4 w-4 text-[#16a34a]" />,
    text: "Haz check-in con NFC",
  },
  {
    icon: <Award className="h-4 w-4 text-[#9333ea]" />,
    text: "Completa misiones",
  },
  {
    icon: <Gift className="h-4 w-4 text-[#ea580c]" />,
    text: "Canjea premios",
  },
];

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[calc(100vh-3.5rem)] min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100vh-4rem)] sm:min-h-[calc(100dvh-4rem)] flex-col justify-center overflow-hidden py-4 sm:py-6 lg:py-8"
    >
      {/* Background illustration */}
      <Image
        src={heroImage}
        alt="Fexpo ilustración de feria"
        fill
        priority
        sizes="100vw"
        className="pointer-events-none -z-10 object-cover object-[70%_center] sm:object-[65%_center] lg:object-center"
      />

      {/* Mobile veil keeps the copy readable over the illustration. */}
      <div data-hero-veil="mobile" className="pointer-events-none absolute inset-0 -z-10 lg:hidden" />

      {/* Desktop veil fades toward the illustration on the right. */}
      <div data-hero-veil="desktop" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 px-5 sm:px-10 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="mx-auto max-w-xl text-center sm:max-w-2xl sm:text-left lg:col-span-7 lg:mx-0">
          {/* Heading with Poppins and Lime activa accent underline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className={`${headingFont.className} text-center text-[2.65rem] leading-[1.02] font-bold tracking-tight sm:text-left sm:text-6xl sm:leading-[1.02] lg:text-7xl xl:text-8xl`}
          >
            Explora. <br />
            Conecta. <br />
            <span className="relative inline-block pb-1.5">
              Vive Fexpo.
              <span className="absolute bottom-0 left-0 -z-10 h-2 sm:h-2.5 w-full rounded-full bg-[#D5F24A]" />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            data-hero-copy
            className="mx-auto mt-5 max-w-xl text-center text-[15px] leading-relaxed font-normal sm:mx-0 sm:mt-6 sm:text-left sm:text-base lg:text-lg"
          >
            La app para ferias que ya tenemos. Explora stands y rutas, haz check-in con NFC y suma puntos en cada visita.
          </motion.p>

          {/* CTAs: Probar demo (Lima) / Ver el panel (Azul feria) / Conoce más (Blanco) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-6 grid max-w-md grid-cols-2 gap-3 sm:mt-7 sm:flex sm:max-w-none sm:flex-row sm:items-center sm:gap-4 lg:justify-start"
          >
            {/* 1. Probar demo */}
            <Link
              href="/demo"
              className="group col-span-2 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#D5F24A] px-7 py-3 text-base font-bold text-[#132D46] shadow-[0_8px_20px_-6px_rgba(213,242,74,0.75)] transition-[transform,box-shadow,background-color] duration-150 ease-out hover:-translate-y-0.5 hover:bg-[#c9e63e] hover:shadow-[0_12px_24px_-6px_rgba(213,242,74,0.9)] active:translate-y-0 active:scale-[0.98] sm:w-auto"
            >
              <span>Probar demo</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5] transition-transform duration-150 ease-out group-hover:translate-x-1" />
            </Link>

            {/* 2. Ver el panel */}
            <Link
              href="/panel"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#132D46] px-6 py-3 text-base font-bold text-white shadow-[0_8px_20px_-8px_rgba(19,45,70,0.45)] transition-[transform,box-shadow,background-color] duration-150 ease-out hover:-translate-y-0.5 hover:bg-[#1a3b5c] hover:shadow-[0_12px_24px_-8px_rgba(19,45,70,0.6)] active:translate-y-0 active:scale-[0.98] sm:w-auto"
            >
              <span className="whitespace-nowrap">Ver el panel</span>
            </Link>

            {/* 3. Conoce más */}
            <a
              href="#problema"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-6 py-3 text-base font-semibold text-[#132D46] shadow-sm transition-[transform,box-shadow,border-color,background-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white active:translate-y-0 active:scale-[0.98] sm:w-auto"
            >
              <span className="whitespace-nowrap">Conoce más</span>
              <ChevronDown className="h-4 w-4 stroke-[2.5]" />
            </a>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-6 grid max-w-md grid-cols-2 gap-2.5 sm:mt-8 sm:max-w-2xl sm:grid-cols-4 sm:gap-3 lg:mx-0"
          >
            {benefits.map((item) => (
              <div
                key={item.text}
                className="flex min-h-12 min-w-0 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur-sm transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                  {item.icon}
                </div>
                <span className="min-w-0 text-xs font-semibold text-[#132D46] sm:text-[13px]">
                  {item.text}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
