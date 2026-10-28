"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { Briefcase, Calendar, Globe, MapPin, TrendingUp, Users } from "lucide-react";
import { DEMO_FIXTURE } from "@/data/demo-fixture";
import { DemoBgShapes } from "./DemoBgShapes";
import { headingFont } from "./fonts";
import { UI_OUT, depthLayers, revealHeading, useScrollFx } from "./scroll-fx";
import fx from "./landing-fx.module.css";

const events = [
  {
    name: DEMO_FIXTURE.event.name,
    location: `${DEMO_FIXTURE.event.city}`,
    locationNote: DEMO_FIXTURE.event.venueStatus,
    status: "PILOTO",
    statusColor: "bg-[var(--expo-yellow)] text-[var(--expo-navy)]",
    desc: "Feria Internacional de La Paz. Plataforma de prueba y desarrollo conceptual.",
    icon: Calendar,
    active: true,
  },
  {
    name: "Expocruz",
    location: "Santa Cruz, Bolivia",
    locationNote: null,
    status: "PROYECCIÓN",
    statusColor: "bg-[var(--expo-blue)]/10 text-[var(--expo-blue)]",
    desc: "Expansión proyectada para ferias multisectoriales de gran escala.",
    icon: TrendingUp,
    active: false,
  },
  {
    name: "La Paz Expone",
    location: "La Paz, Bolivia",
    locationNote: null,
    status: "EJEMPLO",
    statusColor: "bg-[var(--expo-ink)]/10 text-[var(--expo-ink)]",
    desc: "Integración modular para eventos empresariales e industriales.",
    icon: Briefcase,
    active: false,
  },
  {
    name: "Próximos Eventos",
    location: "Nivel Nacional e Internacional",
    locationNote: null,
    status: "ECOSISTEMA",
    statusColor: "bg-[var(--expo-gray)]/15 text-[var(--expo-gray)]",
    desc: "Un perfil común es parte de la propuesta; esta demo no sincroniza datos entre eventos.",
    icon: Users,
    active: false,
  },
];

/** One profile travelling between events: the connector draws from the pilot outward and each event lights as it arrives. */
function playMultiEvent(root: HTMLElement) {
  depthLayers(root);

  const heading = root.querySelector<HTMLElement>("[data-fx-heading]");
  const stopHeading = heading ? revealHeading(heading) : undefined;

  gsap.from(root.querySelectorAll("[data-fx-intro]"), {
    y: 22,
    opacity: 0,
    duration: 0.7,
    ease: UI_OUT,
    stagger: 0.08,
    delay: 0.15,
    scrollTrigger: { trigger: root, start: "top 78%", once: true },
  });

  const track = root.querySelector<HTMLElement>("[data-fx-track]");
  const line = root.querySelector<HTMLElement>("[data-fx-line]");
  const cards = gsap.utils.toArray<HTMLElement>("[data-fx-event]", root);
  const dots = gsap.utils.toArray<HTMLElement>("[data-fx-dot]", root);
  if (track && cards.length) {
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: track, start: "top 92%", end: "bottom 82%", scrub: 0.6 },
    });
    if (line) timeline.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: cards.length }, 0);
    cards.forEach((card, index) => {
      timeline.fromTo(card, { y: 56, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, index * 0.85);
      // El punto conector de cada tarjeta aparece junto con ella: nunca desde scale(0), siempre con opacidad.
      const dot = dots[index];
      if (dot) timeline.fromTo(dot, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }, index * 0.85 + 0.15);
    });
  }

  return stopHeading;
}

export function MultiEventSection() {
  const root = useRef<HTMLElement>(null);
  useScrollFx(root, playMultiEvent);

  return (
    <section
      ref={root}
      id="multi-evento"
      className="relative scroll-mt-24 overflow-hidden border-t border-[var(--expo-line)] bg-white py-20 md:py-28"
    >
      <DemoBgShapes />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <div
            data-fx-intro
            className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[var(--expo-blue)]/15 bg-white px-3.5 py-1.5 text-xs font-bold tracking-wide text-[var(--expo-navy)] shadow-sm"
          >
            <Globe aria-hidden="true" className="h-3.5 w-3.5 text-[var(--expo-blue)]" />
            Datos de demostración · visión multi-evento
          </div>

          <h2
            data-fx-heading
            className={`${headingFont.className} text-4xl leading-[1.15] font-bold tracking-tight text-balance text-[var(--expo-navy)] sm:text-5xl lg:text-6xl`}
          >
            Un perfil. Múltiples eventos. Nuevas conexiones.
          </h2>

          <p data-fx-intro className="mx-auto mt-6 max-w-2xl text-base font-medium text-slate-600 sm:text-lg">
            La experiencia multi-evento es una propuesta en evaluación. Esta demo no comparte ni sincroniza datos entre ferias.
          </p>

        </div>

        {/* Ecosystem: cards joined by a connector, el piloto en azul feria se lee como el ancla de las demás */}
        <div data-fx-track className="relative mt-16">
          <div
            aria-hidden="true"
            data-fx-line
            className="absolute top-[calc(50%-2px)] right-12 left-12 z-0 hidden h-1 origin-left rounded-full bg-[linear-gradient(to_right,#132D46_0%,#D5F24A_100%)] lg:block"
          />
          {events.map((evt, index) => (
            <span
              key={`dot-${evt.name}`}
              aria-hidden="true"
              data-fx-dot
              className="absolute top-1/2 z-[1] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--expo-yellow)] shadow-[0_0_0_3px_rgba(213,242,74,0.25)] lg:block"
              style={{ left: `${12.5 + index * 25}%` }}
            />
          ))}

          <ul className="relative z-10 grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {events.map((evt, index) => {
              const Icon = evt.icon;
              return (
                <li key={evt.name} data-fx-event className="h-full">
                  <div
                    className={`${fx.slab} ${fx.eventCard} flex h-full flex-col justify-between rounded-2xl p-6 [--slab-offset:13px] ${
                      evt.active
                        ? "bg-[var(--expo-navy)] text-white"
                        : "border border-black/5 bg-white text-[var(--expo-navy)]"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs font-black ${evt.active ? "text-white/50" : "text-slate-300"}`}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${evt.statusColor}`}>
                            {evt.status}
                          </span>
                        </div>
                        <span
                          className={`flex h-10 w-10 shrink-0 rotate-45 items-center justify-center rounded-xl ${
                            evt.active ? "bg-black/25" : "bg-[var(--expo-yellow)]/20"
                          }`}
                        >
                          <Icon aria-hidden="true" className={`h-4 w-4 -rotate-45 ${evt.active ? "text-white" : "text-[var(--expo-navy)]"}`} strokeWidth={2.4} />
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-black">{evt.name}</h3>

                      <p className={`mt-1.5 flex items-start gap-1.5 text-xs font-bold ${evt.active ? "text-white/70" : "text-slate-500"}`}>
                        <span className={`${fx.pin} mt-0.5`}>
                          <MapPin aria-hidden="true" className={`h-3.5 w-3.5 ${evt.active ? "text-[var(--expo-yellow)]" : "text-[var(--expo-blue)]"}`} />
                        </span>
                        <span>
                          {evt.location}
                          {evt.locationNote && <><br />{evt.locationNote}</>}
                        </span>
                      </p>

                      <p className={`mt-3 border-t pt-3 text-xs leading-relaxed font-medium ${evt.active ? "border-white/10 text-white/70" : "border-slate-100 text-slate-600"}`}>
                        {evt.desc}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
