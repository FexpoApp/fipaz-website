"use client";

import { useEffect, useState } from "react";
import styles from "./legal.module.css";

export type TocItem = { id: string; title: string };

const linkClass = `${styles.tocLink} block rounded-lg px-3 py-2.5 text-sm font-medium leading-snug text-[#626D78] hover:bg-[#F5F4EF] hover:text-[#132D46]`;

export function LegalToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    // La sección activa es la última cuyo encabezado ya cruzó el tercio superior de la ventana.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const list = (
    <ul className="space-y-0.5">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            aria-current={active === item.id ? "location" : undefined}
            className={linkClass}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <details className="group rounded-2xl border border-[#E2E0D8] bg-white lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold text-[#132D46] [&::-webkit-details-marker]:hidden">
          En esta página
          <svg
            aria-hidden="true"
            viewBox="0 0 12 12"
            className="h-3 w-3 transition-transform duration-200 group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>
        <nav aria-label="Secciones" className="border-t border-[#E2E0D8] p-2">
          {list}
        </nav>
      </details>

      <nav aria-label="Secciones" className="hidden rounded-2xl border border-[#E2E0D8] bg-white p-3 shadow-[0_8px_24px_rgb(19_45_70_/_4%)] lg:block">
        <p className="px-3 pb-2 pt-1 text-xs font-medium uppercase tracking-[0.08em] text-[#132D46]">En esta página</p>
        {list}
      </nav>
    </>
  );
}
