import Link from "next/link";
import { FexpoBrand } from "./fexpo-brand";

type Page = "feedback" | "privacidad" | "terminos";

const links: { href: string; label: string; page: Page | null }[] = [
  { href: "/", label: "Inicio", page: null },
  { href: "/feedback", label: "Feedback", page: "feedback" },
  { href: "/privacidad", label: "Privacidad", page: "privacidad" },
  { href: "/terminos", label: "Términos", page: "terminos" },
];

export function FexpoPageFooter({ current }: { current: Page }) {
  return (
    <footer className="border-t border-[#E2E0D8] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <Link href="/" aria-label="fexpo, ir al inicio" className="inline-flex"><FexpoBrand /></Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#626D78]">Explora la feria. Encuentra tu próxima conexión.</p>
        </div>
        <nav aria-label="Enlaces del pie de página" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.page === current ? "page" : undefined}
              className="font-medium text-[#132D46] underline-offset-4 transition-colors hover:underline aria-[current=page]:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-[#E2E0D8] px-4 py-4 text-center text-xs text-[#626D78]">© 2026 fexpo</div>
    </footer>
  );
}
