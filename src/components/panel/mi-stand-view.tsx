"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Building2, Globe, Mail, Pencil, QrCode, ScanLine, Settings2, Store } from "lucide-react";

import { canEditCompany } from "@/lib/panel-access";
import { useCompanyAuthStore } from "@/store/company-auth-store";
import { ExhibitorState } from "./exhibitor-state";
import { useExhibitor } from "./exhibitor-context";
import { PanelPageHeader } from "./panel-page-header";

export function MiStandView() {
  const { company, stand } = useExhibitor();
  const editable = useCompanyAuthStore((state) => canEditCompany(state.session));

  return (
    <ExhibitorState>
      {stand && <>
        <PanelPageHeader eyebrow="Mi stand" title="Perfil de marca" description="Así se presenta tu stand a quienes visitan la feria." demo={false} />
        <section className="panel-surface overflow-hidden" aria-label="Datos del stand">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8">
            <div className="flex min-h-48 flex-col justify-between rounded-2xl bg-[#132D46] p-5">
              {stand.logoPath ? (
                <Image src={stand.logoPath} alt={`Logo de ${stand.displayName}`} width={64} height={64} className="h-16 w-16 rounded-xl bg-white object-cover shadow-sm" unoptimized />
              ) : (
                <Store aria-hidden="true" className="h-12 w-12 text-[#D5F24A]" strokeWidth={1.5} />
              )}
              <span className="self-start rounded-full bg-[#D5F24A] px-3 py-1.5 text-xs font-semibold text-[#132D46]">Stand {stand.boothCode}</span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#132D46]">{stand.eventName}</p><h2 className="mt-1 text-2xl font-extrabold text-[#132D46] sm:text-[1.8rem]">{stand.displayName}</h2></div>
                <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${stand.status === "active" ? "bg-[#D5F24A] text-[#132D46]" : "bg-[#F5F4EF] text-[#626D78]"}`}>{stand.status === "active" ? "Activo" : stand.status}</span>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-[#626D78]">{stand.description || "Aún no hay una descripción. Puedes agregarla al editar el stand."}</p>
              {stand.tags.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{stand.tags.map((tag) => <span key={tag} className="rounded-full bg-[#F5F4EF] px-3 py-1.5 text-xs font-semibold text-[#626D78]">#{tag}</span>)}</div>}
              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 border-t border-[#e2e0d8] pt-4 text-xs font-semibold text-[#626D78]"><span>+{stand.visitPoints} puntos por visita</span>{company?.contactEmail && <span className="inline-flex items-center gap-1.5"><Mail aria-hidden="true" className="h-3.5 w-3.5" />{company.contactEmail}</span>}{stand.website && <a href={stand.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-[#132D46]"><Globe aria-hidden="true" className="h-3.5 w-3.5" />{stand.website}</a>}</div>
            </div>
          </div>
          {(stand.activityHighlight || stand.promotionHighlight) && <div className="grid gap-3 border-t border-[#e2e0d8] bg-[#F5F4EF] px-5 py-4 sm:grid-cols-2 sm:px-7">{stand.activityHighlight && <p className="text-sm text-[#626D78]"><strong className="text-[#132D46]">Actividad:</strong> {stand.activityHighlight}</p>}{stand.promotionHighlight && <p className="text-sm text-[#626D78]"><strong className="text-[#132D46]">Promoción:</strong> {stand.promotionHighlight}</p>}</div>}
          <div className="flex flex-wrap gap-2 border-t border-[#e2e0d8] px-5 py-4 sm:px-7">
            {editable ? (
              <Link href="/panel/mi-stand/editar" className="inline-flex items-center gap-2 rounded-xl bg-[#132D46] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#111820]"><Pencil aria-hidden="true" className="h-4 w-4" />Editar perfil</Link>
            ) : (
              <button
                type="button"
                disabled
                aria-describedby="stand-edit-permission-help"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500"
              >
                <Pencil aria-hidden="true" className="h-4 w-4" />Editar perfil
              </button>
            )}
            <Link href="/panel/mi-stand/qr" className="inline-flex items-center gap-2 rounded-xl border border-[#e2e0d8] bg-white px-4 py-2.5 text-sm font-bold text-[#132D46] hover:bg-[#F5F4EF]"><QrCode aria-hidden="true" className="h-4 w-4" />Gestionar QR</Link>
            <Link href="/admin" className="inline-flex items-center gap-2 rounded-xl border border-[#e2e0d8] bg-white px-4 py-2.5 text-sm font-bold text-[#132D46] hover:bg-[#F5F4EF]"><Settings2 aria-hidden="true" className="h-4 w-4" />Administrar</Link>
            {!editable && <p id="stand-edit-permission-help" className="basis-full text-xs font-medium text-slate-600">Solo una persona administradora de la empresa puede editar el perfil del stand.</p>}
          </div>
        </section>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link href="/panel/visitas" className="panel-surface flex items-center gap-3 p-4 text-sm font-bold text-[#132D46] hover:border-[#e2e0d8]"><span className="rounded-xl bg-[#F5F4EF] p-2.5 text-[#132D46]"><ScanLine aria-hidden="true" className="h-5 w-5" /></span>Visitas verificadas<ArrowRight aria-hidden="true" className="ml-auto h-4 w-4 text-[#626D78]" /></Link>
          <Link href="/panel/metricas-stand" className="panel-surface flex items-center gap-3 p-4 text-sm font-bold text-[#132D46] hover:border-[#e2e0d8]"><span className="rounded-xl bg-[#F5F4EF] p-2.5 text-[#132D46]"><BarChart3 aria-hidden="true" className="h-5 w-5" /></span>Ver métricas<ArrowRight aria-hidden="true" className="ml-auto h-4 w-4 text-[#626D78]" /></Link>
          <Link href="/panel/empresa" className="panel-surface flex items-center gap-3 p-4 text-sm font-bold text-[#132D46] hover:border-[#e2e0d8]"><span className="rounded-xl bg-[#D5F24A] p-2.5 text-[#132D46]"><Building2 aria-hidden="true" className="h-5 w-5" /></span>Perfil de empresa<ArrowRight aria-hidden="true" className="ml-auto h-4 w-4 text-[#626D78]" /></Link>
        </div>
      </>}
    </ExhibitorState>
  );
}
