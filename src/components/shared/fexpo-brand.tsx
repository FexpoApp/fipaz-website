import Image from "next/image";

/** Firma horizontal compacta para cabeceras y paneles. */
export function FexpoBrand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="fexpo-brand inline-flex items-center gap-2.5 text-[#132D46]" aria-label="fexpo">
      <Image
        src="/img/landing/Fexpo-logo.svg"
        alt=""
        width={40}
        height={56}
        priority
        className="h-14 w-10"
      />
      <span className={`${compact ? "max-[359px]:hidden " : ""}text-[44px] font-extrabold leading-none tracking-[-0.04em]`}>fexpo</span>
    </span>
  );
}
