import type { NextConfig } from "next";

/**
 * El backend (`fexpo-backend`) no habilita CORS, así que el navegador no puede llamarlo
 * directamente. Next reenvía `/api/v1/*` al backend desde el servidor y el navegador solo
 * habla con su propio origen. `BACKEND_URL` es la configuración recomendada; se conserva
 * `NEXT_PUBLIC_AGENT_BACKEND_URL` como alternativa durante la transición de entornos locales.
 */
const backendUrl = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_AGENT_BACKEND_URL)?.trim().replace(/\/+$/, "");

// A production deploy must never silently publish a demo panel or broken login.
if (process.env.VERCEL_ENV === "production") {
  if (!process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID?.trim()) {
    throw new Error("Production requires NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID in Vercel before building.");
  }
  if (!process.env.BACKEND_URL?.trim()) {
    throw new Error("Production requires BACKEND_URL in Vercel before building.");
  }
  if (process.env.NEXT_PUBLIC_API_MODE !== "http" || process.env.NEXT_PUBLIC_DEMO_PANEL_STANDS === "true") {
    throw new Error("Production must use the HTTP backend with demo panel stands disabled.");
  }
}

const nextConfig: NextConfig = {
  async rewrites() {
    if (!backendUrl) return [];
    return [{ source: "/api/v1/:path*", destination: `${backendUrl}/api/v1/:path*` }];
  },
};

export default nextConfig;
