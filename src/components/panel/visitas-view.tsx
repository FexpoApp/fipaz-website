"use client";

import { useEffect, useState } from "react";
import { RefreshCw, ScanLine } from "lucide-react";

import { exhibitorApi, type StandCheckin } from "@/lib/api/exhibitor";
import { ExhibitorState } from "./exhibitor-state";
import { useExhibitor } from "./exhibitor-context";
import { PanelPageHeader } from "./panel-page-header";

export function VisitasView() {
  const { stand } = useExhibitor();
  return <ExhibitorState>{stand && <VisitsForStand key={stand.id} standId={stand.id} />}</ExhibitorState>;
}

const PAGE_SIZE = 20;

function VisitsForStand({ standId }: { standId: string }) {
  const [visits, setVisits] = useState<StandCheckin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  function loadVisits() {
    setLoading(true);
    setError("");
    exhibitorApi.getCheckins(standId)
      .then((rows) => setVisits(rows))
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : "No se pudieron cargar las visitas.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadVisits();
  }, [standId]);

  const totalPages = Math.max(1, Math.ceil(visits.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedVisits = visits.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <PanelPageHeader eyebrow="Visitas verificadas" title="Check-ins registrados" description="Registros confirmados por el servidor para este stand." demo={false} />
      {loading ? (
        <p role="status" className="pixel-card p-8 text-center text-sm font-bold text-slate-500">
          Cargando visitas…
        </p>
      ) : error ? (
        <div role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-5 text-sm text-rose-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={loadVisits}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reintentar
          </button>
        </div>
      ) : visits.length === 0 ? (
        <p className="pixel-card p-5 text-sm text-slate-600">Aún no hay visitas registradas en este stand.</p>
      ) : (
        <>
          <div className="pixel-card divide-y divide-[var(--expo-line)] overflow-hidden">
            {paginatedVisits.map((visit) => (
              <div key={visit.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3">
                  <ScanLine aria-hidden="true" className="h-4 w-4 text-[var(--expo-green)]" />
                  <span className="text-sm font-bold text-[var(--expo-navy)]">Visitante ···{visit.userId.slice(-6)}</span>
                  <span className="text-xs uppercase text-slate-500">{visit.method}</span>
                </div>
                <time dateTime={visit.acceptedAt} className="font-mono text-xs text-slate-500">{new Date(visit.acceptedAt).toLocaleString("es-BO")}</time>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between gap-2 px-1 text-xs font-bold text-slate-600">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40"
              >
                Anterior
              </button>
              <span>Página {currentPage} de {totalPages} ({visits.length} visitas)</span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
