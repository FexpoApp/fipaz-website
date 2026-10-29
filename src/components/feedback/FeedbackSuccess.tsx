import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export function FeedbackSuccess() {
  return (
    <section className="mx-auto max-w-[760px] rounded-[20px] border border-[#E2E0D8] bg-white p-6 shadow-[0_12px_28px_rgb(19_45_70_/_5%)] sm:p-10" aria-labelledby="feedback-complete-title">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D5F24A] text-[#132D46]"><Check aria-hidden="true" className="h-7 w-7" /></span>
      <p className="mt-7 text-xs font-medium uppercase tracking-[0.12em] text-[#626D78]">Encuesta completada</p>
      <h2 id="feedback-complete-title" className="mt-3 text-balance text-3xl font-bold leading-tight text-[#132D46] sm:text-4xl">Gracias por completar la encuesta.</h2>
      <p className="mt-4 max-w-xl text-base leading-7 text-[#626D78]">Esta versión de demostración no guarda ni envía las respuestas. Puedes seguir explorando fexpo.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/demo" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#132D46] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#111820]">Explorar la demo <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
        <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#E2E0D8] bg-white px-5 py-3 text-sm font-medium text-[#132D46] transition-colors hover:bg-[#F5F4EF]">Volver al inicio</Link>
      </div>
    </section>
  );
}
