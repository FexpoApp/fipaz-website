"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface GoogleCredentialResponse { credential?: string }
interface GoogleIdentityApi {
  accounts: { id: {
    initialize: (options: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
    renderButton: (element: HTMLElement, options: { theme: string; size: string; shape: string; text: string; locale: string; width: number }) => void;
  } };
}

declare global { interface Window { google?: GoogleIdentityApi } }

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void;
  /** Client ID web de Google. Por defecto, `NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID`. */
  clientId?: string;
  shape?: "rectangular" | "pill";
}

/** Botón oficial "Continuar con Google". Entrega el `idToken` que el backend valida en `POST /auth/google`. */
export function GoogleSignInButton({
  onCredential,
  clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ?? "",
  shape = "rectangular",
}: GoogleSignInButtonProps) {
  const [scriptReady, setScriptReady] = useState(false);
  const [buttonHost, setButtonHost] = useState<HTMLDivElement | null>(null);
  const onCredentialRef = useRef(onCredential);
  const rendered = scriptReady && Boolean(buttonHost) && Boolean(clientId);

  useEffect(() => { onCredentialRef.current = onCredential; }, [onCredential]);

  useEffect(() => {
    if (!scriptReady || !buttonHost || !clientId || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: ({ credential }) => { if (credential) onCredentialRef.current(credential); },
    });
    window.google.accounts.id.renderButton(buttonHost, {
      // Google solo admite anchos de 200 a 400 px; se ajusta al contenedor para que ocupe todo el ancho de la tarjeta.
      theme: "outline", size: "large", shape, text: "continue_with", locale: "es",
      width: Math.min(400, Math.max(200, Math.round(buttonHost.clientWidth) || 320)),
    });
  }, [scriptReady, buttonHost, clientId, shape]);

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={() => setScriptReady(true)} />
      {clientId ? (
        // Aparece con un fundido cuando Google termina de dibujar el botón, en lugar de "saltar" a la vista.
        <div
          ref={setButtonHost}
          className={`flex min-h-11 w-full items-center justify-center transition-opacity duration-200 ease-out ${shape === "pill" ? "google-sign-in-pill" : ""} ${rendered ? "opacity-100" : "opacity-0"}`}
        />
      ) : (
        <p className="rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-800">
          El acceso con Google no está disponible en este momento. Inténtalo más tarde.
        </p>
      )}
    </>
  );
}
