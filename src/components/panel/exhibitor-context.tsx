"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { exhibitorApi, type CompanyKpis, type ExhibitorCompany, type ExhibitorStand } from "@/lib/api/exhibitor";

interface ExhibitorContextValue {
  company: ExhibitorCompany | null;
  stands: ExhibitorStand[];
  stand: ExhibitorStand | null;
  kpis: CompanyKpis | null;
  loading: boolean;
  error: string | null;
  kpisError: string | null;
  selectStand: (standId: string) => void;
  /** Vuelve a leer empresa, stands y métricas. `false` significa que la fuente de verdad no pudo confirmarse. */
  reload: () => Promise<boolean>;
}

const ExhibitorContext = createContext<ExhibitorContextValue | null>(null);

export function ExhibitorProvider({
  companyId,
  preferredEventId,
  children,
}: {
  companyId: string | null;
  preferredEventId: string | null;
  children: ReactNode;
}) {
  const [company, setCompany] = useState<ExhibitorCompany | null>(null);
  const [stands, setStands] = useState<ExhibitorStand[]>([]);
  const [selectedStandId, setSelectedStandId] = useState<string | null>(null);
  const selectedStandIdRef = useRef<string | null>(null);
  const [kpis, setKpis] = useState<CompanyKpis | null>(null);
  const [loading, setLoading] = useState(Boolean(companyId));
  const [error, setError] = useState<string | null>(null);
  const [kpisError, setKpisError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const initiallyLoadedRef = useRef(false);

  const reload = useCallback(async () => {
    if (!companyId) return false;
    const requestId = ++requestIdRef.current;
    const showInitialLoading = !initiallyLoadedRef.current;
    if (showInitialLoading) setLoading(true);
    try {
      const [nextCompany, nextStands] = await Promise.all([
        exhibitorApi.getCompany(companyId),
        exhibitorApi.getStands(companyId),
      ]);
      if (requestId !== requestIdRef.current) return false;
      const selected = nextStands.find((item) => item.id === selectedStandIdRef.current)
        ?? nextStands.find((item) => item.eventId === preferredEventId)
        ?? nextStands[0];
      setCompany(nextCompany);
      setStands(nextStands);
      setError(null);
      selectedStandIdRef.current = selected?.id ?? null;
      setSelectedStandId(selected?.id ?? null);
      setKpis(null);
      setKpisError(null);
      if (selected) {
        try {
          const nextKpis = await exhibitorApi.getKpis(companyId, selected.eventId);
          if (requestId === requestIdRef.current) setKpis(nextKpis);
        } catch (cause) {
          if (requestId === requestIdRef.current) {
            setKpisError(cause instanceof Error ? cause.message : "No se pudieron cargar las métricas.");
          }
        }
      }
      return requestId === requestIdRef.current;
    } catch (cause) {
      if (requestId !== requestIdRef.current) return false;
      setCompany(null);
      setStands([]);
      selectedStandIdRef.current = null;
      setSelectedStandId(null);
      setKpis(null);
      setError(cause instanceof Error ? cause.message : "No se pudieron cargar los datos de la empresa.");
      return false;
    } finally {
      if (requestId === requestIdRef.current) {
        initiallyLoadedRef.current = true;
        if (showInitialLoading) setLoading(false);
      }
    }
  }, [companyId, preferredEventId]);

  useEffect(() => {
    void Promise.resolve().then(reload);
    return () => { requestIdRef.current += 1; };
  }, [reload]);

  const selectStand = useCallback((standId: string) => {
    selectedStandIdRef.current = standId;
    setSelectedStandId(standId);
    setKpis(null);
    void reload();
  }, [reload]);

  const stand = stands.find((item) => item.id === selectedStandId) ?? null;
  const value = useMemo(() => ({
    company, stands, stand, kpis, loading, error, kpisError,
    selectStand, reload,
  }), [company, stands, stand, kpis, loading, error, kpisError, selectStand, reload]);

  return <ExhibitorContext.Provider value={value}>{children}</ExhibitorContext.Provider>;
}

export function useExhibitor(): ExhibitorContextValue {
  const context = useContext(ExhibitorContext);
  if (!context) throw new Error("El panel de expositor requiere ExhibitorProvider.");
  return context;
}
