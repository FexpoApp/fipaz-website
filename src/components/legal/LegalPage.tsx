import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Mail } from "lucide-react";
import { FexpoBrand } from "@/components/shared/fexpo-brand";
import { FexpoPageFooter } from "@/components/shared/fexpo-page-footer";
import { LegalToc } from "./LegalToc";
import styles from "./legal.module.css";

export const LEGAL_CONTACT_EMAIL = "soporte@fexpo.lat";

export type LegalSection = {
  title: string;
  body: ReactNode;
};

type LegalPageProps = {
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
  current: "privacidad" | "terminos";
};

const documents = [
  { key: "privacidad", href: "/privacidad", label: "Privacidad" },
  { key: "terminos", href: "/terminos", label: "Términos" },
] as const;

function slugify(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function LegalPage({ title, updatedAt, intro, sections, current }: LegalPageProps) {
  const items = sections.map((section) => ({ id: slugify(section.title), title: section.title }));

  return (
    <div className="flex min-h-dvh flex-col bg-[#F5F4EF] text-[#132D46] antialiased">
      <header className="sticky top-0 z-40 border-b border-[#E2E0D8] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" aria-label="fexpo, ir al inicio" className="inline-flex shrink-0"><FexpoBrand /></Link>
          <Link href="/" className={`${styles.back} inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#626D78] transition-colors hover:text-[#132D46]`}>
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            <span className="hidden sm:inline">Volver al inicio</span>
            <span className="sm:hidden">Inicio</span>
          </Link>
        </div>
      </header>

      <div className={styles.hero}>
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#D5F24A]">Información y confianza</p>
          <nav aria-label="Documentos legales" className="mt-5 flex flex-wrap gap-2">
            {documents.map((document) => (
              <Link
                key={document.key}
                href={document.href}
                aria-current={document.key === current ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors ${document.key === current ? "border-[#D5F24A] bg-[#D5F24A] text-[#132D46]" : "border-white/30 text-white hover:border-white"}`}
              >
                {document.label}
              </Link>
            ))}
          </nav>
          <h1 className="mt-7 max-w-3xl text-balance text-[clamp(2.5rem,5vw,4.25rem)] font-bold leading-[1.08] tracking-tight text-white">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">{intro}</p>
          <p className="mt-7 inline-flex items-center gap-2 text-sm text-white/75"><CalendarDays aria-hidden="true" className="h-4 w-4" /> Actualizado el {updatedAt}</p>
        </div>
      </div>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:py-14">
        <aside className="lg:sticky lg:top-28 lg:self-start"><LegalToc items={items} /></aside>
        <article className="min-w-0 max-w-[760px] rounded-[20px] border border-[#E2E0D8] bg-white px-5 py-8 shadow-[0_12px_28px_rgb(19_45_70_/_5%)] sm:px-10 sm:py-10">
          {sections.map((section, index) => (
            <section key={section.title} id={items[index].id} className={`scroll-mt-28 ${index ? "mt-10 border-t border-[#E2E0D8] pt-10" : ""}`}>
              <div className="flex items-start gap-3">
                <span aria-hidden="true" className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#D5F24A] text-xs font-semibold text-[#132D46]">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="pt-0.5 text-balance text-xl font-semibold leading-snug text-[#132D46] sm:text-2xl">{section.title}</h2>
              </div>
              <div className={`${styles.prose} mt-4 space-y-4 text-[15px] leading-7 text-[#626D78] sm:text-base`}>{section.body}</div>
            </section>
          ))}

          <aside className="mt-12 rounded-2xl bg-[#132D46] p-6 text-white sm:p-8">
            <h2 className="text-xl font-semibold leading-snug">¿Tienes dudas sobre este documento?</h2>
            <p className="mt-2 text-sm leading-6 text-white/75">Escríbenos y te ayudamos a encontrar la información que necesitas.</p>
            <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="mt-6 inline-flex min-h-11 max-w-full items-center justify-center gap-2 break-all rounded-xl bg-[#D5F24A] px-5 py-2.5 text-sm font-semibold text-[#132D46] transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-95">
              <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />{LEGAL_CONTACT_EMAIL}
            </a>
          </aside>
        </article>
      </main>

      <FexpoPageFooter current={current} />
    </div>
  );
}
