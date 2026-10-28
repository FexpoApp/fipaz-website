"use client";

import React from "react";
import { motion } from "motion/react";
import { PixelStar } from "./PixelIcons";
import styles from "./HowItWorksSection.module.css";
import { Calendar, Search, MapPin, Smartphone } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Elige tu evento",
    desc: "Explora el evento de ejemplo FIPAZ 2026; sus fechas y recinto están sujetos a confirmación.",
    icon: <Calendar className="h-6 w-6 text-[#132D46]" />,
    tag: "INICIO",
  },
  {
    num: "02",
    title: "Encuentra una empresa o categoría",
    desc: "Filtra por rubro (Tecnología, Salud, Gastronomía, etc.) o busca directamente el stand que quieres visitar.",
    icon: <Search className="h-6 w-6 text-[#132D46]" />,
    tag: "BÚSQUEDA",
  },
  {
    num: "03",
    title: "Sigue la ruta hasta el stand",
    desc: "Consulta un plano referencial con rutas ilustrativas; no indica distancias reales.",
    icon: <MapPin className="h-6 w-6 text-[#132D46]" />,
    tag: "RECORRIDO",
  },
  {
    num: "04",
    title: "Acerca tu teléfono al NFC",
    desc: "La demo simula el check-in, los puntos y el avance de una misión. No registra una visita real.",
    icon: <Smartphone className="h-6 w-6 text-[#132D46]" />,
    tag: "CHECK-IN",
  },
];

// Azul feria sólido en vez del blanco plano: en la sección (fondo blanco) estas tarjetas
// pasan a ser la superficie elevada, en lugar de depender solo de una sombra sobre el mismo
// blanco. El lima activa queda como único acento (ficha del icono y "Paso X/4"), el mismo rol
// — "destaca acciones y momentos" — que ya usamos en las otras tarjetas de la landing.
const cardClass = "relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#132D46] p-6 shadow-[0_20px_45px_-20px_rgba(19,45,70,0.55)]";
const hoverClass = "transition-[transform,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-[#D5F24A]/40";

function Card({ step, index }: { step: (typeof steps)[number]; index: number }) {
  return (
    <>
      <div>
        {/* Top Number Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-4xl font-extrabold text-[#F5F4EF]">
            {step.num}
          </span>
          <div className="rounded-xl bg-[#D5F24A] p-2.5">
            {step.icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-5 text-xl font-black text-[#F5F4EF] leading-tight">
          {step.title}
        </h3>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-[#F5F4EF]/72 font-medium">
          {step.desc}
        </p>
      </div>

      {/* Step tag */}
      <div className="mt-6 pt-3 flex items-center justify-between">
        <span className="rounded-full bg-[#F5F4EF]/12 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[#F5F4EF] uppercase">
          {step.tag}
        </span>
        <span className="text-xs font-bold text-[#D5F24A]">
          Paso {index + 1}/4
        </span>
      </div>
    </>
  );
}

/**
 * The heading and the four steps. On the desktop entrance the pinned scene owns this copy (`scripted`): it appears
 * while the interior opens, driven by the same timeline, so it carries data hooks instead of its own scroll reveal.
 */
export function HowItWorksBody({ scripted = false }: { scripted?: boolean }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className={`${styles.header} mx-auto max-w-3xl text-center`} data-arrival-header={scripted ? "" : undefined}>
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--expo-blue)]/15 bg-white px-3.5 py-1.5 text-xs font-bold tracking-wide text-[var(--expo-navy)] shadow-sm">
          <PixelStar className="w-3.5 h-3.5" />
          Datos de demostración · paso a paso
        </div>

        <h2 className="text-3xl font-black tracking-tight text-[var(--expo-navy)] sm:text-5xl">
          Tu feria, más fácil de recorrer.
        </h2>

        <p className="mt-4 text-lg text-slate-600 font-medium">
          Cuatro sencillos pasos para transformar una visita convencional en una experiencia interactiva y guiada.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, idx) =>
          scripted ? (
            <div key={step.num} data-arrival-card className={cardClass}>
              <Card step={step} index={idx} />
            </div>
          ) : (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.12 }}
              className={`${cardClass} ${hoverClass}`}
            >
              <Card step={step} index={idx} />
            </motion.div>
          ),
        )}
      </div>
    </div>
  );
}

/** Normal document flow. On the desktop entrance it only remains as the `#como-funciona` anchor (see the CSS module). */
export function HowItWorksSection() {
  return (
    <section id="como-funciona" className={`${styles.section} scroll-mt-24 border-t border-[var(--expo-line)] bg-white py-16 md:py-24`}>
      <HowItWorksBody />
    </section>
  );
}

/** The same copy, inside the pinned scene: it fades in over the interior while the iris is still opening. */
export function ArrivalOverlay() {
  return (
    <div className={styles.arrival} aria-label="Cómo funciona Fexpo">
      <div className={styles.wash} data-arrival-wash />
      <div className={styles.arrivalContent}>
        <HowItWorksBody scripted />
      </div>
    </div>
  );
}
