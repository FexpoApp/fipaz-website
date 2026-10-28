/**
 * Diagonal bands + diamonds in lima/gris, bleeding from the section's left/right edges. Reused across
 * the "Datos de demostración" sections (Actors, How-it-works, Map, Multi-event) for a consistent
 * background. Render as a direct child of a `relative overflow-hidden` section, before its content.
 * Each shape carries `data-fx-depth`: call `depthLayers(root)` (scroll-fx.ts) in the section's GSAP
 * setup to give it scroll parallax — sections without a GSAP setup just get it static, which is fine.
 */
export function DemoBgShapes() {
  return (
    <>
      <span aria-hidden="true" data-fx-depth="22" className="pointer-events-none absolute top-[8%] -left-[45%] h-[12%] w-[65%] rotate-45 rounded-[15px] bg-[rgba(213,242,74,0.17)] md:-left-[18%] md:w-[35%] md:rounded-[30px]" />
      <span aria-hidden="true" data-fx-depth="30" className="pointer-events-none absolute top-[41%] -left-[45%] h-[12%] w-[65%] rotate-45 rounded-[15px] bg-[rgba(213,242,74,0.14)] md:-left-[21%] md:w-[38%] md:rounded-[30px]" />
      <span aria-hidden="true" data-fx-depth="16" className="pointer-events-none absolute top-[74%] -left-[15%] h-[9%] w-[22%] rotate-45 rounded-[15px] bg-[rgba(213,242,74,0.07)] md:rounded-[30px]" />

      <span aria-hidden="true" data-fx-depth="26" className="pointer-events-none absolute top-0 -right-[45%] h-[12%] w-[65%] rotate-45 rounded-[15px] bg-[rgba(98,109,120,0.065)] md:-right-[20%] md:w-[35%] md:rounded-[30px]" />
      <span aria-hidden="true" data-fx-depth="34" className="pointer-events-none absolute top-[32%] -right-[45%] h-[13%] w-[65%] rotate-45 rounded-[15px] bg-[rgba(98,109,120,0.15)] md:-right-[21%] md:w-[36%] md:rounded-[30px]" />
      <span aria-hidden="true" data-fx-depth="18" className="pointer-events-none absolute top-[73%] -right-[20%] h-[11%] w-[32%] rotate-45 rounded-[15px] bg-[rgba(98,109,120,0.065)] md:rounded-[30px]" />

      <span aria-hidden="true" data-fx-depth="12" className="pointer-events-none absolute top-[22%] left-[16%] aspect-square w-[4.5%] rotate-45 rounded-[13%] border-[1.5px] border-[rgba(213,242,74,0.8)]" />
      <span aria-hidden="true" data-fx-depth="16" className="pointer-events-none absolute top-[27%] left-[19%] aspect-square w-[7%] rotate-45 rounded-[13%] bg-[rgba(98,109,120,0.18)] opacity-50 md:opacity-100" />
      <span aria-hidden="true" data-fx-depth="10" className="pointer-events-none absolute top-[12%] right-[16%] aspect-square w-[3.4%] rotate-45 rounded-[13%] bg-[rgba(213,242,74,0.76)]" />
      <span aria-hidden="true" data-fx-depth="20" className="pointer-events-none absolute top-[33%] right-[9%] aspect-square w-[8%] rotate-45 rounded-[13%] border-[1.5px] border-[rgba(213,242,74,0.73)]" />
      <span aria-hidden="true" data-fx-depth="14" className="pointer-events-none absolute top-[44%] right-[5%] aspect-square w-[5%] rotate-45 rounded-[13%] bg-[rgba(98,109,120,0.24)] opacity-50 md:opacity-100" />
    </>
  );
}
