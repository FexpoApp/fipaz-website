"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { PixelNfcPlaque } from "./PixelIcons";
import { Zap, Map, Search, Wifi, BarChart3, Smartphone, MapPin, FlaskConical, CheckCircle2, Circle, Gift, ChevronRight } from "lucide-react";
import { DEMO_FIXTURE } from "@/data/demo-fixture";
import { headingFont } from "./fonts";
import { UI_OUT, depthLayers, revealHeading, useScrollFx } from "./scroll-fx";
import fx from "./landing-fx.module.css";

const steps = [
  { num: "01", icon: Search, title: "Descubre stands", desc: "Explora el mapa y encuentra espacios de tu interés." },
  { num: "02", icon: Wifi, title: "Registra tu visita", desc: "Acércate al stand y realiza tu check-in con NFC (simulado)." },
  { num: "03", icon: BarChart3, title: "Sigue avanzando", desc: "Mira tu progreso y acumula puntos en tu recorrido." },
];

const visitedCount = DEMO_FIXTURE.stands.filter((stand) => stand.featured).length;
const totalCount = DEMO_FIXTURE.stands.length;
const visitedPercent = Math.round((visitedCount / totalCount) * 100);

/**
 * The 3 "how it works" steps light up in order along a rail as you scroll, the progress bar fills to the real
 * fixture ratio (2/3 stands) and the reward badge drops in, the one celebratory beat on the right card.
 */
function playNfc(root: HTMLElement) {
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

  const lima = getComputedStyle(document.documentElement).getPropertyValue("--expo-yellow").trim() || "#D5F24A";
  const navy = getComputedStyle(document.documentElement).getPropertyValue("--expo-navy").trim() || "#132D46";
  const list = root.querySelector<HTMLElement>("[data-fx-sequence]");
  const rail = root.querySelector<HTMLElement>("[data-fx-rail]");
  const steps = gsap.utils.toArray<HTMLElement>("[data-fx-step]", root);
  if (list && rail && steps.length) {
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: list, start: "top 88%", end: "bottom 80%", scrub: 0.6 },
    });
    timeline.fromTo(rail, { scaleY: 0 }, { scaleY: 1, duration: steps.length }, 0);
    steps.forEach((step, index) => {
      const chip = step.querySelector<HTMLElement>("[data-fx-chip]");
      timeline.fromTo(step, { opacity: 0.45 }, { opacity: 1, duration: 1 }, index);
      if (chip) timeline.fromTo(chip, { backgroundColor: "transparent", color: lima }, { backgroundColor: lima, color: navy, duration: 1 }, index);
    });
  }

  const columns = root.querySelector<HTMLElement>("[data-fx-columns]");
  if (columns) {
    gsap.from(columns.querySelectorAll<HTMLElement>("[data-fx-in]"), {
      x: (_index: number, element: HTMLElement) => (element.dataset.fxIn === "left" ? -60 : 60),
      opacity: 0,
      duration: 0.9,
      ease: UI_OUT,
      stagger: 0.08,
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: columns, start: "top 82%", once: true },
    });
  }

  const fill = root.querySelector<HTMLElement>("[data-fx-progress]");
  const label = root.querySelector<HTMLElement>("[data-fx-progress-label]");
  if (fill && label) {
    const counter = { value: 0 };
    const trigger = { trigger: fill, start: "top 92%", once: true };
    gsap.fromTo(
      fill,
      { clipPath: "inset(0 100% 0 0 round 999px)" },
      { clipPath: `inset(0 ${100 - visitedPercent}% 0 0 round 999px)`, duration: 1.5, ease: UI_OUT, delay: 0.3, scrollTrigger: trigger },
    );
    gsap.to(counter, {
      value: visitedPercent,
      duration: 1.5,
      ease: UI_OUT,
      delay: 0.3,
      scrollTrigger: trigger,
      onUpdate: () => {
        label.textContent = `${Math.round(counter.value)}%`;
      },
    });
  }

  const reward = root.querySelector<HTMLElement>("[data-fx-reward]");
  if (reward) {
    gsap.from(reward, {
      y: -40,
      scale: 0.9,
      opacity: 0,
      duration: 1.1,
      ease: "back.out(2.2)",
      delay: 0.5,
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: reward, start: "top 94%", once: true },
    });
  }

  depthLayers(root);
  return stopHeading;
}

export function NfcSection() {
  const root = useRef<HTMLElement>(null);
  useScrollFx(root, playNfc);

  return (
    <section ref={root} className="relative overflow-hidden border-t border-[var(--expo-line)] bg-[var(--expo-bg)] py-10 md:py-14">
      <div aria-hidden="true" data-fx-depth="30" className={`${fx.dots} pointer-events-none absolute inset-x-0 -top-24 -bottom-24`} />

      {/* Diagonal lima ribbons, like the reference: bleed off the section edges, behind everything. */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-16 -left-20 h-72 w-40 -rotate-[24deg] rounded-[48px] bg-[var(--expo-yellow)]/35" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-48 -rotate-[20deg] rounded-[56px] bg-[var(--expo-yellow)]/35" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -bottom-16 h-56 w-36 rotate-[18deg] rounded-[44px] bg-[var(--expo-yellow)]/35" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-center overflow-hidden px-4 sm:px-6 lg:aspect-video lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <div
            data-fx-intro
            className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--expo-blue)]/15 bg-white px-3.5 py-1.5 text-xs font-bold tracking-wide text-[var(--expo-navy)] shadow-sm"
          >
            <Zap className="h-3.5 w-3.5 text-[var(--expo-blue)]" />
            EXPERIENCIA INTERACTIVA · DEMOSTRACIÓN
          </div>

          <h2
            data-fx-heading
            className={`${headingFont.className} text-3xl leading-[1.15] font-bold tracking-tight text-balance text-[var(--expo-navy)] sm:text-4xl lg:text-5xl`}
          >
            Cada visita cuenta.
          </h2>

          <p data-fx-intro className="mx-auto mt-3 max-w-2xl text-sm font-medium text-slate-700 sm:text-base">
            Descubre stands, registra visitas y sigue tu recorrido por la feria de una forma diferente.
          </p>
        </div>

        {/* Two columns */}
        <div data-fx-columns className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* Left: how it works, on the primary brand color */}
          <div data-fx-in="left" className="lg:col-span-6">
            <div className={`${fx.slab} flex h-full flex-col rounded-3xl bg-[var(--expo-navy)] p-5 [--slab-color:rgba(19,45,70,0.35)] sm:p-6`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--expo-yellow)]">
                    <Map className="h-5 w-5 text-[var(--expo-navy)]" strokeWidth={2.4} />
                  </span>
                  <h3 className="text-2xl leading-tight font-black text-white sm:text-3xl">
                    Explora la feria
                    <br />
                    <span className="text-[var(--expo-yellow)]">a tu ritmo.</span>
                  </h3>
                  <p className="mt-2 max-w-[22ch] text-sm font-medium text-white/70">
                    Acércate a los stands, realiza tu check-in y ve cómo tu recorrido cobra vida.
                  </p>
                </div>

                {/* Phone + NFC illustration */}
                <div className="relative hidden h-32 w-28 shrink-0 sm:block">
                  <div className="absolute inset-x-3 inset-y-0 flex flex-col items-center justify-center gap-2 rounded-[22px] border border-white/15 bg-white/5">
                    <Smartphone aria-hidden="true" className="h-5 w-5 text-white/35" />
                    <span className="text-base font-bold text-white">fexpo</span>
                  </div>
                  <span className="absolute -top-2 -right-1 rotate-6 drop-shadow-[0_8px_14px_rgba(0,0,0,0.35)]">
                    <PixelNfcPlaque className="h-14 w-14" />
                  </span>
                </div>
              </div>

              {/* 3 steps, joined by a rail that fills as the recorrido advances */}
              <div data-fx-sequence className="relative mt-4 flex-1">
                <span aria-hidden="true" className="absolute top-4 bottom-4 left-[19px] w-0.5 rounded-full bg-white/15">
                  <span data-fx-rail className="block h-full origin-top rounded-full bg-[var(--expo-yellow)]" />
                </span>

                <div className="relative space-y-2">
                  {steps.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.num} data-fx-step className={`${fx.step} relative flex items-start gap-3 rounded-xl bg-white/5 p-2.5`}>
                        <span
                          data-fx-chip
                          className={`${fx.chip} flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--expo-yellow)] font-mono text-xs font-black text-[var(--expo-yellow)]`}
                        >
                          {item.num}
                        </span>
                        <div className="flex min-w-0 flex-1 items-center gap-2.5">
                          <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--expo-yellow)]" />
                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-white">{item.title}</h4>
                            <p className="mt-0.5 text-xs font-medium text-white/60">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: the journey tracker, real fixture data */}
          <div data-fx-in="right" className="lg:col-span-6">
            <div className={`${fx.slab} flex h-full flex-col rounded-3xl border border-black/5 bg-white p-5 [--slab-offset:14px] sm:p-6`}>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-wide text-[var(--expo-navy)] uppercase">
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-[var(--expo-blue)]" />
                  Tu recorrido
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--expo-yellow)]/25 px-2.5 py-1 text-[10px] font-bold text-[var(--expo-navy)] uppercase">
                  <FlaskConical aria-hidden="true" className="h-3 w-3" />
                  Demostración simulada
                </span>
              </div>

              <h3 className="mt-2 text-xl font-black text-[var(--expo-navy)]">{DEMO_FIXTURE.mission.title}</h3>
              <p className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">
                {DEMO_FIXTURE.mission.description} Cada primera visita suma {DEMO_FIXTURE.points.perNewVisit} puntos.
              </p>

              {/* Progress: the fill is revealed, never stretched */}
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-3xl leading-none font-black text-[var(--expo-navy)]">
                  {visitedCount}
                  <span className="text-base font-bold text-slate-400">/{totalCount}</span>
                  <span className="ml-2 align-middle text-xs font-bold text-slate-500">stands visitados</span>
                </p>
                <span data-fx-progress-label className="text-lg font-black text-[var(--expo-navy)] tabular-nums">
                  {visitedPercent}%
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                <div
                  data-fx-progress
                  className="h-full w-full rounded-full bg-[var(--expo-yellow)]"
                  style={{ clipPath: `inset(0 ${100 - visitedPercent}% 0 0 round 999px)` }}
                />
              </div>

              <ul className="mt-2">
                {DEMO_FIXTURE.stands.map((stand) => {
                  const visited = Boolean(stand.featured);
                  return (
                    <li key={stand.id} className="flex items-center gap-3 border-b border-slate-100 py-2 last:border-0">
                      {visited ? (
                        <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0 fill-[var(--expo-yellow)] text-[var(--expo-navy)]" />
                      ) : (
                        <Circle aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-300" strokeDasharray="3 3" />
                      )}
                      <span className={`flex-1 truncate text-sm font-bold ${visited ? "text-[var(--expo-navy)]" : "text-slate-400"}`}>{stand.name}</span>
                      <span className={`shrink-0 text-xs font-bold ${visited ? "text-[var(--expo-navy)]" : "text-slate-400"}`}>+{stand.points} puntos</span>
                      <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-300" />
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto pt-2">
                <div data-fx-reward className={`${fx.rewardCard} flex items-start gap-3 rounded-2xl bg-[var(--expo-yellow)]/15 p-3`}>
                  <span className={`${fx.chest} flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--expo-yellow)]`}>
                    <Gift aria-hidden="true" className="h-5 w-5 text-[var(--expo-navy)]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black tracking-wide text-[var(--expo-navy)] uppercase">Propuesta de recompensa</p>
                    <p className="mt-0.5 text-sm font-bold text-[var(--expo-navy)]">
                      {DEMO_FIXTURE.stands[0].promotion} en {DEMO_FIXTURE.stands[0].name} · {DEMO_FIXTURE.stands[0].boothCode}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-600">Premio ilustrativo, sin cupón válido ni canje confirmado.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p data-fx-intro className="mt-3 text-center text-[11px] font-medium text-slate-500 italic">
          Vista conceptual. Las visitas y puntos mostrados son simulados.
        </p>
      </div>
    </section>
  );
}
