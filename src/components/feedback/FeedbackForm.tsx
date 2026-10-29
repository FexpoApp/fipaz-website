"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

interface FeedbackFormProps {
  onSubmitted: () => void;
}

const panelClass = "rounded-[20px] border border-[#E2E0D8] bg-white p-5 shadow-[0_12px_28px_rgb(19_45_70_/_5%)] sm:p-8";
const fieldClass = "mt-2 block w-full resize-y rounded-xl border border-[#D5D9D5] bg-white px-4 py-3 text-sm leading-6 text-[#132D46] placeholder:text-[#626D78] focus:border-[#132D46] focus:outline-none focus:ring-4 focus:ring-[#D5F24A]/40";
const participantOptions = ["Visitante", "Expositor", "Organizador"];
const featureOptions = ["Mapa", "Búsqueda", "NFC", "Misiones", "Recompensas", "Perfil de expositor"];

function StepHeading({ number, title, description }: { number: string; title: string; description?: string }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D5F24A] text-xs font-semibold text-[#132D46]">{number}</span>
      <div>
        <h2 className="text-lg font-semibold leading-7 text-[#132D46] sm:text-xl">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-[#626D78]">{description}</p>}
      </div>
    </div>
  );
}

function RatingScale({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium leading-6 text-[#132D46]">{label} <span aria-hidden="true">*</span></legend>
      <div className="flex flex-wrap items-center gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            aria-label={`${label}: ${rating} de 5`}
            aria-pressed={value === rating}
            onClick={() => onChange(rating)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${value >= rating ? "border-[#132D46] bg-[#132D46] text-white" : "border-[#D5D9D5] bg-white text-[#626D78] hover:border-[#132D46] hover:text-[#132D46]"}`}
          >
            {rating}
          </button>
        ))}
        <span className="ml-2 text-xs font-medium text-[#626D78]">{value ? `${value} de 5` : "Sin calificar"}</span>
      </div>
    </fieldset>
  );
}

export function FeedbackForm({ onSubmitted }: FeedbackFormProps) {
  const [participantType, setParticipantType] = useState("Visitante");
  const [valueRating, setValueRating] = useState(0);
  const [easeRating, setEaseRating] = useState(0);
  const [intentRating, setIntentRating] = useState(0);
  const [valuableFeature, setValuableFeature] = useState<string[]>([]);
  const [confusingPart, setConfusingPart] = useState("");
  const [missingFeature, setMissingFeature] = useState("");
  const [singleChange, setSingleChange] = useState("");
  const [additionalComment, setAdditionalComment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function toggleFeature(feature: string) {
    setValuableFeature((current) => current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg("");
    if (!valueRating || !easeRating || !intentRating) {
      setErrorMsg("Califica los tres aspectos generales para continuar.");
      return;
    }
    onSubmitted();
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Encuesta de feedback" className="mx-auto max-w-[760px] space-y-5">
      <section className={panelClass} aria-labelledby="feedback-participant-title">
        <div id="feedback-participant-title"><StepHeading number="01" title="Cuéntanos cómo participas" description="Elige la opción que mejor te describa." /></div>
        <div role="group" aria-label="Tipo de participante" className="grid gap-2.5 min-[420px]:grid-cols-3">
          {participantOptions.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={participantType === option}
              onClick={() => setParticipantType(option)}
              className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${participantType === option ? "border-[#132D46] bg-[#132D46] text-white" : "border-[#D5D9D5] bg-white text-[#132D46] hover:border-[#132D46] hover:bg-[#F5F4EF]"}`}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className={panelClass} aria-labelledby="feedback-rating-title">
        <div id="feedback-rating-title"><StepHeading number="02" title="Valora la experiencia" description="Selecciona un número del 1 al 5 en cada pregunta." /></div>
        <div className="space-y-6 divide-y divide-[#E2E0D8] [&>*+*]:pt-6">
          <RatingScale label="Valor de la experiencia" value={valueRating} onChange={setValueRating} />
          <RatingScale label="Facilidad de uso" value={easeRating} onChange={setEaseRating} />
          <RatingScale label="¿La usarías en otra feria?" value={intentRating} onChange={setIntentRating} />
        </div>
      </section>

      <section className={panelClass} aria-labelledby="feedback-features-title">
        <div id="feedback-features-title"><StepHeading number="03" title="¿Qué te resultó más útil?" description="Puedes elegir varias funciones." /></div>
        <div role="group" aria-label="Funciones valiosas" className="flex flex-wrap gap-2.5">
          {featureOptions.map((feature) => {
            const selected = valuableFeature.includes(feature);
            return (
              <button
                key={feature}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleFeature(feature)}
                className={`min-h-10 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selected ? "border-[#132D46] bg-[#D5F24A] text-[#132D46]" : "border-[#D5D9D5] bg-white text-[#132D46] hover:border-[#132D46] hover:bg-[#F5F4EF]"}`}
              >
                {feature}
              </button>
            );
          })}
        </div>
      </section>

      <section className={panelClass} aria-labelledby="feedback-comments-title">
        <div id="feedback-comments-title"><StepHeading number="04" title="Ayúdanos a mejorar" description="Estas respuestas son opcionales." /></div>
        <div className="space-y-6">
          <div><label htmlFor="feedback-confusing" className="text-sm font-medium text-[#132D46]">¿Qué parte te resultó confusa?</label><textarea id="feedback-confusing" rows={3} value={confusingPart} onChange={(event) => setConfusingPart(event.target.value)} placeholder="Por ejemplo, cómo encontrar un stand" className={fieldClass} /></div>
          <div><label htmlFor="feedback-missing" className="text-sm font-medium text-[#132D46]">¿Qué función te hizo falta?</label><textarea id="feedback-missing" rows={3} value={missingFeature} onChange={(event) => setMissingFeature(event.target.value)} placeholder="Por ejemplo, una agenda de actividades" className={fieldClass} /></div>
          <div><label htmlFor="feedback-change" className="text-sm font-medium text-[#132D46]">Si pudieras cambiar una sola cosa, ¿cuál sería?</label><textarea id="feedback-change" rows={3} value={singleChange} onChange={(event) => setSingleChange(event.target.value)} placeholder="Cuéntanos qué cambiarías primero" className={fieldClass} /></div>
          <div><label htmlFor="feedback-additional" className="text-sm font-medium text-[#132D46]">Comentario adicional</label><textarea id="feedback-additional" rows={2} value={additionalComment} onChange={(event) => setAdditionalComment(event.target.value)} placeholder="Cualquier otra idea" className={fieldClass} /></div>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-[#E2E0D8] bg-white p-4 text-sm leading-6 text-[#626D78]">
        <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#132D46]" />
        <p>Esta encuesta es una demostración: las respuestas no se guardan ni se envían. <Link href="/privacidad" className="font-semibold text-[#132D46] underline underline-offset-2">Consulta nuestra política de privacidad.</Link></p>
      </div>

      {errorMsg && <p role="alert" className="rounded-xl border border-[#132D46] bg-white p-4 text-sm font-medium text-[#132D46]">{errorMsg}</p>}

      <button type="submit" className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#D5F24A] px-6 py-3 text-base font-semibold text-[#132D46] shadow-[0_8px_20px_rgb(19_45_70_/_10%)] transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-95 active:translate-y-0">
        Finalizar encuesta <ArrowRight aria-hidden="true" className="h-5 w-5" />
      </button>
    </form>
  );
}
