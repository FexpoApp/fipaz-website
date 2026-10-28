import type { LucideIcon } from "lucide-react";

import { DemoBadge } from "@/components/shared/demo-badge";

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  /** Toda cifra del panel es de ejemplo salvo que se indique lo contrario. */
  demo?: boolean;
  tone?: "blue" | "violet" | "amber" | "rose" | "mint" | "neutral";
  className?: string;
}

const tones = {
  blue: "bg-[#132D46] text-white",
  violet: "bg-[#F5F4EF] text-[#132D46]",
  amber: "bg-[#D5F24A] text-[#132D46]",
  rose: "bg-[#F5F4EF] text-[#132D46]",
  mint: "bg-[#D5F24A] text-[#132D46]",
  neutral: "bg-[#F5F4EF] text-[#626D78]",
} as const;

export function MetricCard({ label, value, icon: Icon, hint, demo = true, tone = "blue", className = "" }: MetricCardProps) {
  const isTextValue = value.length > 5;
  return (
    <div className={`pixel-card flex min-w-0 flex-col gap-3 p-4 sm:p-5 ${className}`}>
      {/* La etiqueta reserva 2 líneas para que las cifras de una misma fila queden alineadas aunque una etiqueta se parta. */}
      <div className="flex items-start gap-3 sm:gap-3.5">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 sm:rounded-[13px] ${tones[tone]}`}><Icon aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.4} /></span>
        <div className="min-w-0 flex-1 sm:pt-0.5">
          <p className="min-h-10 text-[13px] font-medium leading-5 text-[#626D78]">{label}</p>
          <p className={`mt-1 font-bold tracking-tight ${isTextValue ? "text-sm sm:text-base leading-snug text-[#626D78]" : "text-[clamp(1.6rem,2.4vw,2.1rem)] leading-none text-[#132D46]"}`}>{value}</p>
        </div>
      </div>
      {hint && <p className="mt-auto text-xs font-normal text-[#626D78]">{hint}</p>}
      {demo && <DemoBadge className="self-start" />}
    </div>
  );
}
