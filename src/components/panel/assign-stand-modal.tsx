"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

import { organizerApi, type AssignStandInput, type StandAssignmentResponse } from "@/lib/api/organizer";

interface AssignStandModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  company: { companyId: string; displayName: string } | null;
  onSuccess: (stand: StandAssignmentResponse) => void;
}

export function AssignStandModal({ isOpen, onClose, eventId, company, onSuccess }: AssignStandModalProps) {
  const [boothCode, setBoothCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen && company) {
      setBoothCode("");
      setDisplayName(company.displayName);
      setDescription("");
      setTagsInput("");
      setError("");
      setSuccessMsg("");
    }
  }, [isOpen, company]);

  if (!isOpen || !company) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!company) return;

    const cleanCode = boothCode.trim().toUpperCase();
    if (!cleanCode) {
      setError("El código de stand es obligatorio.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: AssignStandInput = {
        companyId: company.companyId,
        boothCode: cleanCode,
        displayName: displayName.trim() || company.displayName,
        description: description.trim() || null,
        tags: tags.length > 0 ? tags : undefined,
        status: "active",
      };

      const result = await organizerApi.assignStand(eventId, payload);
      setSuccessMsg(`Stand ${result.boothCode} asignado exitosamente.`);
      onSuccess(result);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (cause: unknown) {
      if (cause instanceof Error) {
        if (cause.message.includes("BOOTH_CODE_IN_USE") || cause.message.toLowerCase().includes("ya está asignado") || cause.message.toLowerCase().includes("en uso")) {
          setError(`El código de stand "${cleanCode}" ya está ocupado en este evento. Por favor ingresa otro.`);
        } else {
          setError(cause.message || "No se pudo asignar el stand.");
        }
      } else {
        setError("Ocurrió un error al asignar el stand.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-stand-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div className="pixel-card relative w-full max-w-lg overflow-hidden bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={18} />
        </button>

        <h2 id="assign-stand-title" className="text-xl font-black text-[var(--expo-navy)]">
          Asignar stand a {company.displayName}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Crea y vincula un stand físico o virtual dentro del evento para esta empresa participante.
        </p>

        {error && (
          <div role="alert" className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm font-semibold text-rose-800">
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        {successMsg && (
          <div role="status" className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="booth-code-input" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Código de stand *
            </label>
            <input
              id="booth-code-input"
              type="text"
              required
              maxLength={30}
              placeholder="Ej. A-12"
              value={boothCode}
              onChange={(e) => setBoothCode(e.target.value.toUpperCase())}
              className="mt-1.5 w-full rounded-xl border border-[#d7e3f3] bg-white px-3.5 py-2.5 font-mono text-sm font-bold text-[#172344] outline-none transition focus:border-[#0878f9] focus:ring-2 focus:ring-[#0878f9]/15"
            />
          </div>

          <div>
            <label htmlFor="stand-display-name-input" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Nombre visual del stand
            </label>
            <input
              id="stand-display-name-input"
              type="text"
              maxLength={160}
              placeholder={company.displayName}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#d7e3f3] bg-white px-3.5 py-2.5 text-sm text-[#172344] outline-none transition focus:border-[#0878f9] focus:ring-2 focus:ring-[#0878f9]/15"
            />
          </div>

          <div>
            <label htmlFor="stand-desc-input" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Descripción del stand (opcional)
            </label>
            <textarea
              id="stand-desc-input"
              rows={2}
              maxLength={300}
              placeholder="Breve reseña de la exhibición"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#d7e3f3] bg-white px-3.5 py-2 text-sm text-[#172344] outline-none transition focus:border-[#0878f9] focus:ring-2 focus:ring-[#0878f9]/15"
            />
          </div>

          <div>
            <label htmlFor="stand-tags-input" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Etiquetas (opcionales, separadas por coma)
            </label>
            <input
              id="stand-tags-input"
              type="text"
              placeholder="salud, farmacia, tecnologia"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#d7e3f3] bg-white px-3.5 py-2 text-sm text-[#172344] outline-none transition focus:border-[#0878f9] focus:ring-2 focus:ring-[#0878f9]/15"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="min-h-10 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#0878f9] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#0067d9] active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Asignando…
                </>
              ) : (
                "Asignar stand"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

