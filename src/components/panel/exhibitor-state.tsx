"use client";

import type { ReactNode } from "react";

import { useExhibitor } from "./exhibitor-context";

export function ExhibitorState({ children, requireStand = true }: { children: ReactNode; requireStand?: boolean }) {
  const { company, stands, stand, loading, error, reload, selectStand } = useExhibitor();

  if (loading) return (
    <div role="status" aria-busy="true" className="space-y-5">
      <span className="sr-only">Cargando datos del expositor…</span>
      <div aria-hidden="true" className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        <div className="h-9 w-64 max-w-full animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
      </div>
      <div aria-hidden="true" className="panel-surface grid min-h-64 animate-pulse gap-6 bg-slate-50 p-5 motion-reduce:animate-none sm:p-7 lg:grid-cols-[250px_minmax(0,1fr)]">
        <div className="min-h-48 rounded-2xl bg-slate-200" />
        <div className="space-y-4 py-2">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-8 w-3/5 rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-4/5 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
  if (error) return (
    <div role="alert" aria-labelledby="exhibitor-load-error" className="rounded-xl border-2 border-rose-400 bg-rose-50 p-5 text-rose-900">
      <h2 id="exhibitor-load-error" className="text-lg font-black">
        {requireStand ? "No pudimos cargar tu stand" : "No pudimos cargar los datos de tu empresa"}
      </h2>
      <p className="mt-2 text-sm">{error}</p>
      <button type="button" onClick={() => void reload()} className="mt-4 rounded-lg border-2 border-rose-800 bg-white px-4 py-2 text-sm font-bold hover:bg-rose-100">
        Reintentar
      </button>
    </div>
  );
  if (!company) return <p role="alert">No se encontró la empresa de esta cuenta.</p>;
  if (requireStand && !stand) return (
    <div role="status" className="pixel-card p-6">
      <h2 className="font-black text-[var(--expo-navy)]">Aún no tienes un stand asignado</h2>
      <p className="mt-2 text-sm text-slate-600">Tu empresa está registrada, pero el organizador todavía no le asignó un stand. Cuando lo haga, aparecerá aquí.</p>
      <button type="button" onClick={() => void reload()} className="mt-4 text-sm font-bold text-[var(--expo-blue)] underline">Actualizar</button>
    </div>
  );

  return (
    <>
      {stands.length > 1 && (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 rounded-xl border border-[var(--expo-line)] bg-white p-4">
          <div>
            <label htmlFor="exhibitor-active-stand" className="text-sm font-black text-[var(--expo-navy)]">Stand activo</label>
            <p id="exhibitor-active-stand-help" className="mt-1 text-xs text-slate-600">Tienes varios stands. Elige cuál quieres consultar o gestionar.</p>
          </div>
          <select
            id="exhibitor-active-stand"
            aria-describedby="exhibitor-active-stand-help"
            value={stand?.id ?? ""}
            onChange={(event) => selectStand(event.target.value)}
            className="min-w-60 rounded-lg border-2 border-[var(--expo-line)] bg-white px-3 py-2 text-sm font-bold text-[var(--expo-navy)]"
          >
            {stands.map((item) => <option key={item.id} value={item.id}>{item.eventName} · Stand {item.boothCode}</option>)}
          </select>
        </div>
      )}
      {children}
    </>
  );
}
