"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "react-qr-code";
import { AlertTriangle, Loader2, QrCode, ScanLine, ShieldOff } from "lucide-react";

import { adminRoutes } from "@/config/admin-routes";
import { exhibitorApi, type IssuedStandQr } from "@/lib/api/exhibitor";
import { ExhibitorState } from "./exhibitor-state";
import { useExhibitor } from "./exhibitor-context";
import { PanelPageHeader } from "./panel-page-header";

export function QrStandView() {
  const { stand } = useExhibitor();
  const [ttl, setTtl] = useState(60);
  const [maxScans, setMaxScans] = useState<number | string>(10);
  const [issued, setIssued] = useState<(IssuedStandQr & { standId: string }) | null>(null);
  const [revokedInfo, setRevokedInfo] = useState<{ qrId: string } | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activeIssued = issued?.standId === stand?.id ? issued : null;
  const secondsLeft = activeIssued && now !== null
    ? Math.max(0, Math.ceil((Date.parse(activeIssued.expiresAt) - now) / 1000))
    : 0;

  async function generate(event?: React.FormEvent) {
    if (event) event.preventDefault();
    if (!stand) return;

    setValidationError("");
    setError("");

    const numScans = typeof maxScans === "number" ? maxScans : Number(maxScans);
    if (maxScans === "" || isNaN(numScans) || numScans < 1) {
      setValidationError("El máximo de escaneos debe ser al menos 1.");
      return;
    }
    if (numScans > 1000) {
      setValidationError("El máximo de escaneos no puede superar 1000.");
      return;
    }

    if (ttl < 10 || ttl > 3600) {
      setValidationError("La duración debe estar entre 10 segundos y 1 hora.");
      return;
    }

    setBusy(true);
    try {
      const result = await exhibitorApi.issueQr(stand.id, ttl, numScans);
      setIssued({ ...result, standId: stand.id });
      setRevokedInfo(null);
      setNow(Date.now());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo emitir el QR.");
    } finally {
      setBusy(false);
    }
  }

  async function revoke() {
    if (!activeIssued) return;
    const targetQrId = activeIssued.qrId;
    setBusy(true);
    setError("");
    try {
      await exhibitorApi.revokeQr(targetQrId);
      setRevokedInfo({ qrId: targetQrId });
      setIssued(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo revocar el QR.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ExhibitorState>
      <PanelPageHeader
        eyebrow="Mi stand · QR"
        title="QR de check-in"
        description="Emite un código real del servidor para que los visitantes registren su visita a tu stand."
        demo={false}
      />
      {stand && (
        <div className="space-y-5">
          <div className="pixel-card flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <h2 className="font-black text-[var(--expo-navy)]">Escanear el QR de un visitante</h2>
              <p className="text-sm text-slate-600">Usa la cámara para registrar un check-in con el QR personal del visitante.</p>
            </div>
            <Link
              href={adminRoutes.scan(stand.id)}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--expo-navy)] bg-[var(--expo-yellow)] px-4 py-2 text-sm font-black"
            >
              <ScanLine className="h-4 w-4" />
              Abrir escáner
            </Link>
          </div>

          <div className="pixel-card max-w-2xl space-y-4 p-5">
            <h2 className="font-black text-[var(--expo-navy)]">Emitir QR del stand</h2>

            <form onSubmit={generate} noValidate className="space-y-4">
              <div>
                <label htmlFor="qr-ttl" className="block text-sm font-bold text-[var(--expo-navy)]">
                  Duración
                </label>
                <select
                  id="qr-ttl"
                  value={ttl}
                  onChange={(event) => {
                    setTtl(Number(event.target.value));
                    setValidationError("");
                  }}
                  className="mt-1 block w-full max-w-xs rounded-lg border-2 border-slate-300 bg-white p-2 text-sm font-bold text-[var(--expo-navy)]"
                >
                  <option value={30}>30 segundos</option>
                  <option value={60}>1 minuto</option>
                  <option value={120}>2 minutos</option>
                  <option value={300}>5 minutos</option>
                  <option value={900}>15 minutos</option>
                  <option value={1800}>30 minutos</option>
                  <option value={3600}>1 hora (máximo permitido)</option>
                </select>
              </div>

              <div>
                <label htmlFor="qr-max-scans" className="block text-sm font-bold text-[var(--expo-navy)]">
                  Máximo de escaneos
                </label>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <input
                    id="qr-max-scans"
                    type="number"
                    min={1}
                    max={1000}
                    value={maxScans}
                    onChange={(event) => {
                      setMaxScans(event.target.value === "" ? "" : Number(event.target.value));
                      setValidationError("");
                    }}
                    placeholder="10"
                    className="block w-36 rounded-lg border-2 border-slate-300 bg-white p-2 text-sm font-bold text-[var(--expo-navy)]"
                  />
                  <div className="flex gap-1.5">
                    {[1, 10, 50, 100].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setMaxScans(preset);
                          setValidationError("");
                        }}
                        className={`rounded-md border px-2.5 py-1 text-xs font-bold transition-colors ${
                          maxScans === preset
                            ? "border-[var(--expo-navy)] bg-[var(--expo-navy)] text-white"
                            : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {validationError && (
                <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm font-bold text-rose-700">
                  {validationError}
                </p>
              )}

              {error && (
                <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm font-bold text-rose-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--expo-navy)] bg-[var(--expo-blue)] px-4 py-2 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
                Generar QR
              </button>
            </form>

            {revokedInfo && !activeIssued && (
              <div role="status" className="rounded-xl border-2 border-slate-300 bg-slate-50 p-4 text-slate-800">
                <div className="flex items-center gap-2 font-bold text-sm text-[var(--expo-navy)]">
                  <ShieldOff className="h-4 w-4 text-rose-600" />
                  Código QR revocado
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  El código con ID <span className="font-mono">{revokedInfo.qrId}</span> fue revocado y ha dejado de funcionar. Ya no aceptará nuevos escaneos.
                </p>
              </div>
            )}

            {activeIssued && secondsLeft > 0 && (
              <div className="space-y-4 border-t border-slate-200 pt-5">
                <div role="note" className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-amber-950">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                    <div>
                      <p className="font-extrabold text-sm text-amber-900">
                        Guárdalo ahora: no se puede recuperar al recargar
                      </p>
                      <p className="mt-1 text-xs text-amber-800">
                        Por seguridad, el token se emite una sola vez y no se almacena en texto plano en el servidor. Si recargas o sales de esta pantalla, el código dejará de mostrarse.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="inline-block rounded-xl border-2 border-[var(--expo-navy)] bg-white p-4 shadow-sm">
                  <QRCode value={activeIssued.token} size={220} />
                </div>

                <div className="space-y-1">
                  <p role="status" className="text-sm font-bold text-[var(--expo-navy)]">
                    Expira en {secondsLeft} segundos.
                  </p>
                  <p className="font-mono text-xs text-slate-500">ID del QR: {activeIssued.qrId}</p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => void revoke()}
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-rose-300 bg-white px-3.5 py-1.5 text-sm font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                  >
                    <ShieldOff className="h-4 w-4" />
                    Revocar QR
                  </button>
                </div>
              </div>
            )}

            {activeIssued && secondsLeft === 0 && (
              <p role="status" className="text-sm font-bold text-slate-500">
                El último QR expiró. Puedes generar uno nuevo.
              </p>
            )}

            <p className="text-xs text-slate-500">
              El servidor entrega el token una sola vez. Al salir o recargar esta página, el código deja de mostrarse; los QR anteriores conservan su vencimiento y límite en el servidor.
            </p>
          </div>
        </div>
      )}
    </ExhibitorState>
  );
}
