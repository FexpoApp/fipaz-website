"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, LogIn } from "lucide-react";

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "¿Qué es Fexpo?", href: "#problema" },
    { name: "Cómo funciona", href: "#como-funciona" },
    { name: "Mapa", href: "#mapa" },
    { name: "Para expositores", href: "#expositores" },
    { name: "Para organizadores", href: "#organizadores" },
    { name: "Contacto", href: "#escribenos" },
  ];

  return (
    <header data-landing-header className="sticky top-0 z-50 h-14 sm:h-16 w-full border-b border-[var(--expo-line)] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="#inicio"
          aria-label="Fexpo, ir al inicio"
          className="group flex items-center gap-[6px] transition-transform hover:scale-105 sm:gap-2"
        >
          <Image
            src="/img/landing/fexpo-isotipo.svg"
            alt=""
            width={221}
            height={310}
            priority
            unoptimized
            className="h-[24px] w-auto sm:h-[30px]"
          />
          <span className="text-2xl font-bold leading-none tracking-tight text-[#132D46] sm:text-3xl">
            fexpo
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 text-sm font-medium lg:flex xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              data-nav-link
              className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium text-[#132D46] transition-colors xl:px-3 hover:bg-[#F5F4EF] hover:text-[#132D46]"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button: Lima activa (#D5F24A) con texto Azul feria (#132D46) */}
        <div className="hidden items-center lg:flex">
          <Link
            href="/panel"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#D5F24A] px-5 py-2 text-sm font-semibold text-[#132D46] shadow-[0_6px_16px_-6px_rgba(213,242,74,0.7)] transition-[transform,box-shadow,background-color] duration-150 ease-out hover:-translate-y-0.5 hover:bg-[#c9e63e] hover:shadow-[0_8px_20px_-6px_rgba(213,242,74,0.85)] active:translate-y-0 active:scale-[0.97]"
          >
            <LogIn className="h-4 w-4 stroke-[2.5]" />
            <span className="text-sm font-semibold">Login</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/panel"
            className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-xl bg-[#D5F24A] px-3.5 py-1.5 text-xs font-semibold text-[#132D46] shadow-sm transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            <LogIn className="h-3.5 w-3.5 stroke-[2.5]" />
            <span className="text-xs font-semibold">Login</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-menu-toggle
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-[#132D46] shadow-sm transition-colors hover:bg-slate-50"
            aria-label="Alternar menú"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="max-h-[calc(100vh-56px)] overflow-y-auto border-b border-[var(--expo-line)] bg-white px-4 pt-2 pb-6 shadow-lg animate-in slide-in-from-top-2 lg:hidden">
          <div className="flex flex-col space-y-2 text-base font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                data-nav-link
                className="rounded-md px-3 py-2.5 text-base font-medium text-[#132D46] hover:bg-[#F5F4EF] hover:text-[#132D46]"
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-3">
              <Link
                href="/panel"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D5F24A] py-3 text-center text-base font-semibold text-[#132D46] shadow-[0_6px_16px_-6px_rgba(213,242,74,0.7)] transition-transform duration-150 ease-out active:scale-[0.98]"
              >
                <LogIn className="h-5 w-5 stroke-[2.5]" />
                <span className="text-base font-semibold">Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
