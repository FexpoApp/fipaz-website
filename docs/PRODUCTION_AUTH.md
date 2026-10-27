# Acceso de producción: fexpo.lat

`fexpo.lat` y todos sus subdominios son producción. El sitio principal se despliega
en el proyecto Vercel `fexpo`; la PWA `app.fexpo.lat` es otro proyecto,
`fexpo-app`. Sus variables no se comparten automáticamente.

## Configuración del proyecto fexpo

Variables del destino **Production**, guardadas mediante Vercel CLI:

| Variable | Valor |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID` | `492704011109-3479bq36uucvnqlsjrlfatur1fb3kjhu.apps.googleusercontent.com` |
| `BACKEND_URL` | `https://api.fexpo.lat` |
| `NEXT_PUBLIC_API_MODE` | `http` |
| `NEXT_PUBLIC_FIPAZ_EVENT_ID` | `e0000000-0000-4000-8000-000000000001` |
| `NEXT_PUBLIC_DEMO_PANEL_STANDS` | `false` |
| `NEXT_PUBLIC_PASSWORD_LOGIN_ENABLED` | `false` |

Se conserva la variable existente `NEXT_PUBLIC_CONTACT_ENDPOINT`. No se almacenan
claves privadas, secretos JWT ni credenciales de base de datos en estas variables
públicas. El client ID OAuth es un identificador público, no un client secret.

`NEXT_PUBLIC_AGENT_BACKEND_URL` y `NEXT_PUBLIC_API_BASE_URL` se dejan sin definir:
el navegador usa `/api/v1`, que Next reenvía al backend con `BACKEND_URL`. Así el
acceso Google, la identidad/roles y las llamadas del panel usan el mismo origen.

El evento indicado es el único activo encontrado en el backend actual; no se
crearon datos para las pruebas. Cambiar su UUID y reconstruir cuando corresponda
publicar otro evento. El modo HTTP evita fixtures del frontend, aunque los datos
existentes en el backend se siguen administrando por sus propios procedimientos.

## Cambios y despliegues

Las variables `NEXT_PUBLIC_*` se incorporan al JavaScript durante `next build`.
Cambiar una variable en Vercel exige un despliegue nuevo; crear `.env.local` en
una computadora no modifica la web publicada.

```bash
vercel env ls production --project fexpo
vercel env update NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID production --project fexpo
vercel deploy --project fexpo --prod --skip-domain --yes
# Verificar la URL preparada mediante vercel curl y luego publicar:
vercel promote <url-o-id> --yes
```

`next.config.ts` rechaza un build Vercel Production sin cliente Google, sin
`BACKEND_URL` o con API mock/stands demo activados. El mensaje para el visitante
no muestra nombres de variables ni instrucciones de archivos locales si Google
no está disponible.

## Google

En el cliente web de Google anterior, autorizar el origen JavaScript exacto:

```text
https://fexpo.lat
```

La PWA requiere también `https://app.fexpo.lat` en ese cliente, porque es otro
origen. Registrar una URI de redireccionamiento no sustituye la autorización
del origen JavaScript del flujo Google Identity Services usado aquí.

## Pruebas de producción sin crear datos

```bash
NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=492704011109-3479bq36uucvnqlsjrlfatur1fb3kjhu.apps.googleusercontent.com \
  node scripts/smoke-production-auth.mjs https://fexpo.lat
```

Requiere Playwright Chromium; puede elegirse un ejecutable instalado mediante
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Verifica HTTPS y `/acceso`, proxy real
hacia readiness PostgreSQL, rechazo de rutas privadas sin token y de un token
Google inválido. En Chromium móvil verifica botón Google visible con el client
ID esperado, ausencia del error de configuración y apertura de popup con origen
`https://fexpo.lat`. No introduce credenciales ni completa login con una cuenta
real, ni modifica usuarios, empresas o roles.

Evidencia local: `test-results/production-auth/` (ignorado por Git). Las pruebas
`e2e/real-backend.spec.ts` son para la base local aislada y no deben ejecutarse
contra producción con cuentas o datos de prueba.
