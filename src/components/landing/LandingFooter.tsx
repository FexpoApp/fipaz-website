"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PixelStar } from "./PixelIcons";
import fx from "./landing-fx.module.css";

const linkClass = `${fx.underline} text-sm font-bold transition-colors duration-150 hover:text-[var(--expo-blue)]`;

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--expo-line)] bg-white py-12 text-[var(--expo-navy)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Brand & tagline */}
          <div className="flex flex-col items-center gap-1 sm:items-start">
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
              <span className="text-2xl font-bold leading-none tracking-tight text-[#132D46] sm:text-3xl">
                fexpo
              </span>
            </Link>
            <p className="text-xs font-semibold text-slate-500">Explora la feria. Encuentra tu próxima conexión.</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-7 text-sm font-bold">
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
          </div>

          {/* Mandatory badge tag */}
          <div
            className={`${fx.slab} inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-[var(--expo-bg)] px-3.5 py-1.5 text-xs font-bold [--slab-lift:1px] [--slab-offset:4px]`}
          >
            <PixelStar className="h-3.5 w-3.5" color="#D5F24A" />
            Demo conceptual · 2026
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs font-medium text-slate-500">
          <p>© 2026 Fexpo. Plataforma digital para ferias y eventos físicos.</p>
        </div>
      </div>
    </footer>
  );
}
