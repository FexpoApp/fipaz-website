"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Building2, Filter, MapPin, Plus, Search, Tag } from "lucide-react";

import { organizerApi, type EventCategory, type EventCompany } from "@/lib/api/organizer";
import { listStands } from "@/lib/panel-stands";
import type { StandListItemDto } from "@/types/stands-api";
import { AssignStandModal } from "./assign-stand-modal";
import { NoEventNotice, useOrganizerEvent } from "./organizer-event";
import { PanelPageHeader } from "./panel-page-header";

export interface UnifiedExpositorItem {
  companyId: string;
  eventCompanyId: string;
  displayName: string;
  description: string | null;
  status: string;
  standCount: number;
  stands: StandListItemDto[];
  categories: Array<{ id: string; slug: string; label: string }>;
}

export function ExpositoresList() {
  const { eventId, eventName } = useOrganizerEvent();

  const [companies, setCompanies] = useState<EventCompany[]>([]);
  const [stands, setStands] = useState<StandListItemDto[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [standFilter, setStandFilter] = useState<"all" | "with_stand" | "without_stand">("all");

  const [assignModalTarget, setAssignModalTarget] = useState<{ companyId: string; displayName: string } | null>(null);

  const loadData = useCallback(async () => {
    if (!eventId) {
      setCompanies([]);
      setStands([]);
      setCategories([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const [companiesRes, standsRes, categoriesRes] = await Promise.all([
        organizerApi.getCompanies(eventId).catch(() => []),
        listStands(eventId, { limit: 100 }).then((res) => res.items).catch(() => []),
        organizerApi.getCategories(eventId).catch(() => []),
      ]);

      setCompanies(companiesRes);
      setStands(standsRes);
      setCategories(categoriesRes);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo cargar el directorio de expositores.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, [loadData]);

  // Unifica empresa, participación y stands por UUID
  const unifiedItems: UnifiedExpositorItem[] = useMemo(() => {
    const companyMap = new Map<string, UnifiedExpositorItem>();

    for (const comp of companies) {
      companyMap.set(comp.companyId, {
        companyId: comp.companyId,
        eventCompanyId: comp.id,
        displayName: comp.displayName,
        description: comp.description,
        status: comp.status,
        standCount: comp.standCount,
        stands: [],
        categories: [],
      });
    }

    for (const stand of stands) {
      const compId = stand.company?.id;
      let target = compId ? companyMap.get(compId) : undefined;

      if (!target && compId) {
        target = {
          companyId: compId,
          eventCompanyId: compId,
          displayName: stand.company?.displayName ?? stand.displayName,
          description: stand.description,
          status: "active",
          standCount: 1,
          stands: [],
          categories: [],
        };
        companyMap.set(compId, target);
      }

      if (target) {
        target.stands.push(stand);
        if (stand.categories) {
          for (const cat of stand.categories) {
            if (!target.categories.some((existing) => existing.id === cat.id || existing.slug === cat.slug)) {
              target.categories.push(cat);
            }
          }
        }
      }
    }

    return Array.from(companyMap.values());
  }, [companies, stands]);

  // Filtros combinados: categoría, búsqueda de texto y estado de stand
  const filteredItems = useMemo(() => {
    const query = searchInput.trim().toLowerCase();

    return unifiedItems.filter((item) => {
      // Filtro de stand
      if (standFilter === "with_stand" && item.stands.length === 0) return false;
      if (standFilter === "without_stand" && item.stands.length > 0) return false;

      // Filtro de categoría
      if (selectedCategory !== "all") {
        const matchesCategory = item.categories.some(
          (c) => c.slug.toLowerCase() === selectedCategory.toLowerCase() ||
                 c.label.toLowerCase() === selectedCategory.toLowerCase() ||
                 c.id === selectedCategory
        );
        if (!matchesCategory) return false;
      }

      // Filtro de texto
      if (query) {
        const inName = item.displayName.toLowerCase().includes(query);
        const inDesc = item.description?.toLowerCase().includes(query) ?? false;
        const inBooths = item.stands.some((s) => s.boothCode.toLowerCase().includes(query));
        const inTags = item.stands.some((s) => s.tags?.some((t) => t.toLowerCase().includes(query)));
        if (!inName && !inDesc && !inBooths && !inTags) return false;
      }

      return true;
    });
  }, [unifiedItems, standFilter, selectedCategory, searchInput]);

  return (
    <>
      <PanelPageHeader
        eyebrow="Organizador"
        title="Directorio de expositores"
        description={`Empresas participantes y stands registrados en ${eventName}.`}
      />

      {!eventId ? (
        <NoEventNotice />
      ) : (
        <>
          {/* Barra de Filtros y Búsqueda */}
          <div className="mb-6 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="expositores-search"
                  type="search"
                  maxLength={100}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar empresa, código de stand o etiqueta…"
                  className="min-h-11 w-full rounded-xl border border-[#d7e3f3] bg-white pl-10 pr-4 py-2 text-sm text-[#172344] outline-none transition placeholder:text-slate-500 focus:border-[#0878f9] focus:ring-2 focus:ring-[#0878f9]/15"
                />
              </div>

              {/* Selector de Categoría */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-400" />
                <label htmlFor="category-filter" className="sr-only">Filtrar por categoría</label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="min-h-11 rounded-xl border border-[#d7e3f3] bg-white px-3 py-2 text-sm font-semibold text-[#172344] outline-none transition focus:border-[#0878f9]"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.label}
                    </option>
                  ))}
                  {!categories.some((c) => c.slug.toLowerCase() === "salud" || c.label.toLowerCase() === "salud") && (
                    <option value="salud">Salud</option>
                  )}
                </select>
              </div>

              {/* Filtro rápido de estado */}
              <select
                id="stand-status-filter"
                value={standFilter}
                onChange={(e) => setStandFilter(e.target.value as "all" | "with_stand" | "without_stand")}
                className="min-h-11 rounded-xl border border-[#d7e3f3] bg-white px-3 py-2 text-sm font-semibold text-[#172344] outline-none transition focus:border-[#0878f9]"
              >
                <option value="all">Todos los estados</option>
                <option value="with_stand">Con stand</option>
                <option value="without_stand">Sin stand</option>
              </select>
            </div>

            {/* Píldoras de Categorías para acceso rápido */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Tag size={12} /> Categorías:
              </span>
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  selectedCategory === "all"
                    ? "bg-[#0878f9] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Todas
              </button>
              {categories.map((cat) => {
                const isSelected = selectedCategory.toLowerCase() === cat.slug.toLowerCase() || selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(isSelected ? "all" : cat.slug)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      isSelected
                        ? "bg-[#0878f9] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Estado de Carga o Error */}
          {loading ? (
            <div role="status" aria-busy="true" className="pixel-card divide-y divide-[var(--expo-line)] overflow-hidden">
              <span className="sr-only">Cargando expositores…</span>
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="h-16 animate-pulse bg-slate-100" />
              ))}
            </div>
          ) : error ? (
            <div role="alert" className="rounded-2xl border-2 border-rose-500 bg-rose-50 p-5 text-sm font-bold text-rose-800">
              <p>{error}</p>
              <button type="button" onClick={() => void loadData()} className="mt-3 underline underline-offset-2">
                Reintentar
              </button>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="pixel-card divide-y divide-[var(--expo-line)] overflow-hidden">
              {filteredItems.map((item) => {
                const hasStand = item.stands.length > 0;
                const primaryStand = hasStand ? item.stands[0] : null;

                return (
                  <div
                    key={item.companyId}
                    className="flex flex-wrap items-center justify-between gap-4 p-4 transition hover:bg-[var(--expo-bg)]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-[#0878f9] shrink-0" />
                        {primaryStand ? (
                          <Link
                            href={`/panel/expositores/${primaryStand.id}`}
                            className="truncate text-base font-extrabold text-[var(--expo-navy)] hover:text-[#0878f9] hover:underline"
                          >
                            <span>{item.displayName}</span>
                            <span className="font-mono text-xs text-slate-500 ml-2">· {item.stands.map((s) => s.boothCode).join(", ")}</span>
                          </Link>
                        ) : (
                          <p className="truncate text-base font-extrabold text-[var(--expo-navy)]">
                            {item.displayName}
                          </p>
                        )}
                      </div>

                      {/* Información de Stands Asignados */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {hasStand ? (
                          item.stands.map((st) => (
                            <Link
                              key={st.id}
                              href={`/panel/expositores/${st.id}`}
                              className="inline-flex items-center gap-1 rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-0.5 font-mono text-xs font-bold text-[var(--expo-blue)] hover:underline"
                            >
                              <MapPin size={12} /> Stand {st.boothCode}
                            </Link>
                          ))
                        ) : (
                          <span className="inline-flex items-center rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                            Sin stand asignado
                          </span>
                        )}

                        {/* Categorías */}
                        {item.categories.map((cat) => (
                          <span
                            key={cat.id || cat.slug}
                            className="rounded-lg bg-[var(--expo-sky)] px-2 py-0.5 text-xs font-bold text-[var(--expo-navy)]"
                          >
                            {cat.label}
                          </span>
                        ))}
                      </div>

                      {item.description && (
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Botón de Asignación */}
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAssignModalTarget({ companyId: item.companyId, displayName: item.displayName })}
                        aria-label={`Asignar stand a ${item.displayName}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#0878f9] bg-white px-3.5 py-1.5 text-xs font-bold text-[#0878f9] transition hover:bg-[#0878f9] hover:text-white active:scale-[0.98]"
                      >
                        <Plus size={14} /> Asignar stand
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="pixel-card px-6 py-12 text-center text-sm font-medium text-slate-500">
              No hay empresas o stands que coincidan con la búsqueda y filtros seleccionados.
            </div>
          )}

          {/* Modal de Asignación de Stand */}
          <AssignStandModal
            isOpen={assignModalTarget !== null}
            onClose={() => setAssignModalTarget(null)}
            eventId={eventId}
            company={assignModalTarget}
            onSuccess={() => {
              void loadData();
            }}
          />
        </>
      )}
    </>
  );
}
