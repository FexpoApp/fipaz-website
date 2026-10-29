"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, ChevronDown, Menu } from "lucide-react";

import { getActivePanel, getActiveRole, getRolesForPanel } from "@/lib/panel-access";
import { useCompanyAuthStore } from "@/store/company-auth-store";
import { useExhibitor } from "./exhibitor-context";
import { PanelAccountMenu } from "./panel-account-menu";
import { FexpoBrand } from "@/components/shared/fexpo-brand";

interface PanelNavbarProps {
  onMenuClick: () => void;
}

export function PanelNavbar({ onMenuClick }: PanelNavbarProps) {
  const session = useCompanyAuthStore((state) => state.session);
  const activePanel = getActivePanel(session);
  const activeRole = getActiveRole(session);
  const { stand } = useExhibitor();
  const eventName = activePanel === "expositor" ? stand?.eventName ?? "Evento por asignar" : activeRole?.eventName ?? "Evento por seleccionar";
  const detail = activePanel === "expositor" ? stand ? `Stand ${stand.boothCode}` : "Panel de expositor" : "Panel de organizador";
  const multipleEvents = activePanel === "organizador" && getRolesForPanel(session, "organizador").filter((role) => role.eventId).length > 1;
  const eventContent = <>
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D5F24A] text-[#132D46]"><CalendarDays aria-hidden="true" className="h-5 w-5" /></span>
    <span className="min-w-0 text-left"><span className="block truncate text-sm font-semibold text-[#132D46]">{eventName}</span><span className="block truncate text-xs font-normal text-[#626D78]">{detail}</span></span>
    {multipleEvents && <ChevronDown aria-hidden="true" className="ml-auto h-4 w-4 shrink-0 text-[#626D78]" />}
  </>;

  return (
    <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between gap-3 border-b border-[#e2e0d8] bg-white/95 px-4 backdrop-blur-md sm:px-7 lg:px-9">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir navegación del panel"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e2e0d8] text-[#132D46] hover:bg-[#F5F4EF] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/panel" aria-label="fexpo, ir al resumen" className="shrink-0 lg:hidden"><FexpoBrand compact /></Link>
        {multipleEvents ? <Link href="/panel/eventos" className="panel-surface hidden min-w-0 items-center gap-3 px-3 py-2.5 hover:border-[#132D46] lg:flex lg:w-[340px]">{eventContent}</Link> : <div className="panel-surface hidden min-w-0 items-center gap-3 px-3 py-2.5 lg:flex lg:w-[340px]">{eventContent}</div>}
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <Link
          href="/"
          className="hidden items-center gap-1 text-xs font-medium text-[#626D78] hover:text-[#132D46] md:inline-flex"
        >
          Ir al sitio <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
        <span aria-hidden="true" className="hidden h-7 w-px bg-[#e2e0d8] md:block" />
        <PanelAccountMenu />
      </div>
    </header>
  );
}
