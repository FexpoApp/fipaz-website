"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { UI_OUT, useScrollFx } from "./scroll-fx";
import fx from "./landing-fx.module.css";

const linkClass = `${fx.underline} text-sm font-bold transition-colors duration-150 hover:text-[var(--expo-blue)]`;

/** A quiet rise-in so the footer doesn't land abruptly after the animated sections above it. */
function playFooter(root: HTMLElement) {
  gsap.from(root.querySelectorAll("[data-fx-intro]"), {
    y: 16,
    opacity: 0,
    duration: 0.6,
    ease: UI_OUT,
    stagger: 0.08,
    clearProps: "all",
    scrollTrigger: { trigger: root, start: "top 95%", once: true },
  });
}

export function LandingFooter() {
  const root = useRef<HTMLElement>(null);
  useScrollFx(root, playFooter);

  return (
    <footer ref={root} data-landing-footer className="border-t border-[var(--expo-line)] bg-white py-12 text-[var(--expo-navy)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-7">
          {/* Brand & tagline */}
          <div data-fx-intro className="flex flex-col items-center gap-1.5">
            <Link
              href="#inicio"
              aria-label="Fexpo, ir al inicio"
              className="group inline-flex items-center gap-[6px] transition-transform hover:scale-105 sm:gap-2"
            >
              <Image
                src="/img/landing/fexpo-isotipo.svg"
                alt=""
                width={221}
                height={310}
                unoptimized
                className="h-[26px] w-auto sm:h-[30px]"
              />
              <span className="text-2xl font-bold leading-none tracking-tight text-[var(--expo-navy)] sm:text-3xl">
                fexpo
              </span>
            </Link>
            <p className="text-xs font-semibold text-slate-500">Explora la feria. Encuentra tu próxima conexión.</p>
          </div>

          {/* Links */}
          <nav aria-label="Enlaces del pie de página" data-fx-intro className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm font-bold">
            <a href="#inicio" className={linkClass}>
              Inicio
            </a>
            <Link href="/demo" className={linkClass}>
              Demo
            </Link>
            <Link href="/panel" className={linkClass}>
              Panel
            </Link>
            <Link href="/feedback" className={linkClass}>
              Feedback
            </Link>
            <Link href="/privacidad" className={linkClass}>
              Privacidad
            </Link>
            <Link href="/terminos" className={linkClass}>
              Términos
            </Link>
          </nav>
        </div>

        <div data-fx-intro className="mt-8 border-t border-slate-200 pt-6 text-center text-xs font-medium text-slate-500">
          <p>© 2026 Fexpo. Plataforma digital para ferias y eventos físicos.</p>
        </div>
      </div>
    </footer>
  );
}
