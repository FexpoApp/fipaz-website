import { DemoBadge } from "@/components/shared/demo-badge";

interface PanelPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Solo las superficies que declaran explícitamente datos de demostración muestran la insignia. */
  demo?: boolean;
}

export function PanelPageHeader({ eyebrow, title, description, demo = false }: PanelPageHeaderProps) {
  return (
    <div className="mb-7">
      <div className="flex flex-wrap items-center gap-2">
        {eyebrow && <p className="pixel-label text-[#132D46]">{eyebrow}</p>}
        {demo && <DemoBadge />}
      </div>
      <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-[#132D46] sm:text-[2.2rem]">
        {title}
      </h1>
      {description && (
        <p className="mt-1.5 max-w-2xl text-sm font-normal leading-6 text-[#626D78]">{description}</p>
      )}
    </div>
  );
}
