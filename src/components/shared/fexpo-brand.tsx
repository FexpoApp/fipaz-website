import Image from "next/image";

/** Firma horizontal compacta para cabeceras y paneles. `variant="white"` la vuelve legible sobre fondos oscuros. */
export function FexpoBrand({ compact = false, variant = "navy" }: { compact?: boolean; variant?: "navy" | "white" }) {
  return (
    <span
      className={`fexpo-brand inline-flex items-center gap-2.5 ${variant === "white" ? "text-white" : "text-[#132D46]"}`}
      aria-label="fexpo"
    >
      <Image
        src="/img/landing/Fexpo-logo.svg"
        alt=""
        width={40}
        height={56}
        priority
        className={`h-14 w-10 ${variant === "white" ? "brightness-0 invert" : ""}`}
      />
      <span className={`${compact ? "max-[359px]:hidden " : ""}text-[44px] font-extrabold leading-none tracking-[-0.04em]`}>fexpo</span>
    </span>
  );
}
