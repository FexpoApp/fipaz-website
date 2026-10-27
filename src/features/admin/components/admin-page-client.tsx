"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { AdminHome } from "./admin-home";
import type { EventSummary, StandSummary } from "../admin-scope";
import { adminScopeService } from "../admin-scope";
import { exhibitorApi } from "@/lib/api/exhibitor";
import { getActiveCompany, hasPanelAccess } from "@/lib/panel-access";
import { useCompanyAuthStore } from "@/store/company-auth-store";

export function AdminPageClient() {
  const session = useCompanyAuthStore((state) => state.session);
  const hydrated = useCompanyAuthStore((state) => state.hasHydrated);
  const [stand, setStand] = useState<StandSummary | null>(null);
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;

    async function resolveScope() {
      if (session) {
        const organizer = hasPanelAccess(session, "organizador");
        if (!cancelled) setIsOrganizer(organizer);

        const company = getActiveCompany(session);
        const activeEvent = session.activeEvent;
        if (company) {
          try {
            const stands = await exhibitorApi.getStands(company.id);
            const foundStand = stands.find((s) => s.eventId === activeEvent?.id) ?? stands[0];
            if (foundStand && !cancelled) {
              setStand({
                id: foundStand.id,
                name: foundStand.displayName,
                boothCode: foundStand.boothCode,
              });
              setEvent({
                id: activeEvent?.id ?? foundStand.eventId,
                name: activeEvent?.name ?? foundStand.eventName,
              });
              setLoading(false);
              return;
            }
          } catch {
            // fallback
          }
        }
        if (activeEvent && !cancelled) {
          setEvent({ id: activeEvent.id, name: activeEvent.name });
        }
      }

      try {
        const defaultScope = await adminScopeService.getDefaultScope();
        if (!cancelled) {
          setStand((prev) => prev ?? defaultScope.stand);
          setEvent((prev) => prev ?? defaultScope.event);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }

    void resolveScope();
    return () => { cancelled = true; };
  }, [hydrated, session]);

  if (loading || !stand || !event) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-3 text-sm font-bold text-slate-400">
        <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin text-[var(--expo-blue)]" />
        <span>Cargando administración…</span>
      </div>
    );
  }

  return <AdminHome stand={stand} event={event} isOrganizer={isOrganizer} />;
}

